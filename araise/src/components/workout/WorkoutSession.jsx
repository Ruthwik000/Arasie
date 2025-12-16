import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle, 
  Camera, 
  Dumbbell,
  Users,
  Heart,
  X
} from "lucide-react"
import { workoutData } from "../../data/workoutData"
import CameraSelectionModal from "../CameraSelectionModal"
import RepInputModal from "./RepInputModal"
import { isMobile } from "../../utils/helpers"
import { useUserStore } from "../../store/userStore"

// Workout Session Component
export default function WorkoutSession() {
  const { category, splitId, dayId } = useParams()
  const navigate = useNavigate()
  const [currentExercise, setCurrentExercise] = useState(0)
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [pendingExercise, setPendingExercise] = useState(null)
  const [completedSets, setCompletedSets] = useState({})
  const [workoutSession, setWorkoutSession] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)
  
  // Rep input modal state
  const [showRepModal, setShowRepModal] = useState(false)
  const [selectedSet, setSelectedSet] = useState(null)
  
  const { 
    startWorkoutSession, 
    updateExerciseInSession, 
    currentWorkoutSession,
    saveWorkoutSession,
    loadWorkoutProgress
  } = useUserStore()
  
  const getSessionData = () => {
    const splitData = workoutData[category]?.[splitId]
    if (!splitData) return null
    
    // Handle exercise-based (stretching programs with exercises array)
    if (splitData.exercises && !splitData.days) {
      return {
        name: splitData.name,
        exercises: splitData.exercises.map((exercise, index) => ({
          id: exercise.id || index + 1,
          exerciseName: exercise.name,
          reps: exercise.duration,
          description: exercise.description || '',
          pose_analyzer: exercise.pose_analyzer || false,
          isPose: true,
          isStretch: true
        }))
      }
    }
    
    // Handle sequence-based (yoga with sequence array)
    if (splitData.sequence) {
      return {
        name: splitData.name,
        exercises: splitData.sequence.map((pose, index) => ({
          id: index + 1,
          exerciseName: pose.pose,
          reps: pose.duration,
          description: pose.description,
          pose_analyzer: false,
          isPose: true
        }))
      }
    }
    
    // Handle day-based (gym/calisthenics)
    if (dayId && splitData.days?.[dayId]) {
      return {
        name: splitData.days[dayId].splitDay || splitData.days[dayId].name,
        exercises: splitData.days[dayId].exercises
      }
    }
    
    return null
  }

  const sessionData = getSessionData()

  // Initialize workout session when component mounts
  useEffect(() => {
    const initializeWorkout = async () => {
      if (sessionData && !currentWorkoutSession) {
        // Try to load saved progress first
        const savedProgress = await loadWorkoutProgress(splitId, dayId)
        
        if (savedProgress) {
          // Resume from saved progress
          setWorkoutSession(savedProgress)
        } else {
          // Start new workout session
          const workoutPlan = {
            planName: sessionData.name,
            planId: splitId,
            dayId: dayId,
            type: category,
            exercises: sessionData.exercises.map(exercise => ({
              ...exercise,
              completed: false,
              completedSets: 0,
              totalSets: parseInt(exercise.sets) || 1,
              setProgress: {}
            }))
          }
          
          const session = startWorkoutSession(workoutPlan)
          setWorkoutSession(session)
        }
      }
    }
    
    initializeWorkout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData, currentWorkoutSession, category, splitId, dayId])

  // Load saved progress when currentWorkoutSession updates
  useEffect(() => {
    if (currentWorkoutSession && currentWorkoutSession.exercises) {
      // Restore completed sets from saved session
      const savedSets = {}
      currentWorkoutSession.exercises.forEach((exercise, exerciseIndex) => {
        if (exercise.setProgress) {
          Object.keys(exercise.setProgress).forEach(setIndex => {
            // Reconstruct the full key format: "exerciseIndex-setIndex"
            const fullKey = `${exerciseIndex}-${setIndex}`
            savedSets[fullKey] = exercise.setProgress[setIndex]
          })
        }
      })
      setCompletedSets(savedSets)
      
      // If there's a current exercise saved, navigate to it
      if (currentWorkoutSession.currentExercise !== undefined) {
        setCurrentExercise(currentWorkoutSession.currentExercise)
      }
    }
  }, [currentWorkoutSession])

  if (!sessionData) {
    return <div className="text-center text-ar-gray">Session not found</div>
  }

  const exercise = sessionData.exercises[currentExercise]
  const isLastExercise = currentExercise === sessionData.exercises.length - 1

  // Helper function to check if setProgress value is legacy (boolean) or new (object) format
  const isLegacyFormat = (value) => {
    return typeof value === 'boolean'
  }

  // Helper function to get set details (handles both legacy and new format)
  const getSetDetails = (exerciseIndex, setIndex) => {
    const key = `${exerciseIndex}-${setIndex}`
    const value = completedSets[key]
    
    if (!value) {
      return { completed: false, actualReps: null }
    }
    
    // Legacy format (boolean)
    if (isLegacyFormat(value)) {
      return { completed: value, actualReps: null }
    }
    
    // New format (object)
    return value
  }

  const handleSetClick = (exerciseIndex, setIndex) => {
    // Enforce sequential set completion
    // User can only enter reps for a set if all previous sets are completed
    if (setIndex > 0) {
      // Check if previous set is completed
      const previousSetData = completedSets[`${exerciseIndex}-${setIndex - 1}`]
      const isPreviousCompleted = previousSetData && (previousSetData === true || previousSetData.completed)
      
      if (!isPreviousCompleted) {
        // Show error message or toast (for now, just return)
        alert(`Please complete Set ${setIndex} first before moving to Set ${setIndex + 1}`)
        return
      }
    }
    
    // Open modal for rep input
    setSelectedSet({ exerciseIndex, setIndex })
    setShowRepModal(true)
  }

  const handleRepSave = (actualReps) => {
    if (!selectedSet) return
    
    const { exerciseIndex, setIndex } = selectedSet
    const key = `${exerciseIndex}-${setIndex}`
    
    // Create new set progress with object format
    const newCompletedSets = {
      ...completedSets,
      [key]: actualReps === null 
        ? null  // Mark as incomplete if no reps entered
        : { completed: true, actualReps }
    }
    
    setCompletedSets(newCompletedSets)
    
    // Calculate completed sets count for this exercise
    const totalSets = parseInt(exercise.sets) || 3
    let completedCount = 0
    for (let i = 0; i < totalSets; i++) {
      const setData = newCompletedSets[`${exerciseIndex}-${i}`]
      if (setData && (setData === true || setData.completed)) {
        completedCount++
      }
    }
    
    // Filter setProgress to only include sets for this specific exercise
    const exerciseSetProgress = {}
    for (let i = 0; i < totalSets; i++) {
      const key = `${exerciseIndex}-${i}`
      if (newCompletedSets[key]) {
        exerciseSetProgress[i] = newCompletedSets[key]
      }
    }
    
    // Update exercise in session with real-time saving
    const isExerciseCompleted = completedCount === totalSets
    updateExerciseInSession(exerciseIndex, {
      completedSets: completedCount,
      completed: isExerciseCompleted,
      setProgress: exerciseSetProgress // Save only this exercise's set progress
    })
    
    // Auto-save progress to Firebase
    saveWorkoutProgress(exerciseIndex, completedCount, isExerciseCompleted, exerciseSetProgress)
    
    // Close modal
    setShowRepModal(false)
    setSelectedSet(null)
  }

  const handleRepModalClose = () => {
    setShowRepModal(false)
    setSelectedSet(null)
  }

  const saveWorkoutProgress = async (exerciseIndex, completedSets, isCompleted, setProgress) => {
    if (!currentWorkoutSession) {
      console.warn('No current workout session to save')
      return
    }
    
    setIsSaving(true)
    try {
      // Create a partial workout session data for saving progress
      const progressData = {
        id: currentWorkoutSession.id,
        planName: currentWorkoutSession.planName,
        planId: currentWorkoutSession.planId,
        dayId: currentWorkoutSession.dayId,
        type: currentWorkoutSession.type,
        startTime: currentWorkoutSession.startTime,
        currentExercise: exerciseIndex,
        exercises: currentWorkoutSession.exercises.map((ex, idx) => ({
          ...ex,
          completed: idx === exerciseIndex ? isCompleted : ex.completed,
          completedSets: idx === exerciseIndex ? completedSets : ex.completedSets,
          setProgress: idx === exerciseIndex ? setProgress : ex.setProgress
        })),
        isInProgress: true, // Flag to indicate this is a progress save, not completion
        lastUpdated: new Date().toISOString()
      }
      
      // Save to Firebase (this will be handled by the store)
      await saveWorkoutSession(progressData)
    } catch (error) {
      console.error('Error saving workout progress:', error)
      alert('Failed to save workout progress. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getCompletedSetsCount = (exerciseIndex) => {
    const totalSets = parseInt(exercise.sets) || 3
    let completed = 0
    for (let i = 0; i < totalSets; i++) {
      const setData = completedSets[`${exerciseIndex}-${i}`]
      // Handle both legacy (boolean) and new (object) formats
      if (setData && (setData === true || setData.completed)) {
        completed++
      }
    }
    return completed
  }

  const isExerciseComplete = (exerciseIndex) => {
    const totalSets = parseInt(exercise.sets) || 3
    return getCompletedSetsCount(exerciseIndex) === totalSets
  }

  const handleNext = async () => {
    if (isLastExercise) {
      // Save the workout with actual rep data before navigating to complete page
      if (currentWorkoutSession) {
        setIsSaving(true)
        try {
          // Calculate workout duration
          const startTime = new Date(currentWorkoutSession.startTime)
          const endTime = new Date()
          const duration = Math.round((endTime - startTime) / 60000) // minutes
          
          // Create completed workout data with actual rep tracking
          const completedWorkoutData = {
            id: currentWorkoutSession.id,
            planName: currentWorkoutSession.planName,
            planId: currentWorkoutSession.planId,
            dayId: currentWorkoutSession.dayId,
            category: category,
            type: currentWorkoutSession.type,
            status: "completed",
            date: new Date(currentWorkoutSession.startTime).toISOString().slice(0, 10),
            startTime: currentWorkoutSession.startTime,
            endTime: endTime.toISOString(),
            duration: duration,
            exercises: currentWorkoutSession.exercises.map(ex => ({
              ...ex,
              completed: true // Mark all as completed when finishing
            })),
            completed: true,
            totalExercises: currentWorkoutSession.exercises.length,
            completedExercises: currentWorkoutSession.exercises.length
          }
          
          // Save to Firebase
          await saveWorkoutSession(completedWorkoutData)
        } catch (error) {
          console.error('Error saving completed workout:', error)
          alert('Failed to save workout. Please try again.')
        } finally {
          setIsSaving(false)
        }
      }
      
      const completePath = dayId 
        ? `/workout/${category}/${splitId}/${dayId}/complete`
        : `/workout/${category}/${splitId}/complete`
      navigate(completePath)
    } else {
      // Save current exercise progress AND update to next exercise
      const nextExerciseIndex = currentExercise + 1
      if (currentWorkoutSession) {
        const completedCount = getCompletedSetsCount(currentExercise)
        const isCompleted = isExerciseComplete(currentExercise)
        
        // Filter setProgress for current exercise only
        const totalSets = parseInt(exercise.sets) || 3
        const currentExerciseSetProgress = {}
        for (let i = 0; i < totalSets; i++) {
          const key = `${currentExercise}-${i}`
          if (completedSets[key]) {
            currentExerciseSetProgress[i] = completedSets[key]
          }
        }
        
        // Save with the NEXT exercise index so resume works correctly
        setIsSaving(true)
        try {
          const progressData = {
            id: currentWorkoutSession.id,
            planName: currentWorkoutSession.planName,
            planId: currentWorkoutSession.planId,
            dayId: currentWorkoutSession.dayId,
            type: currentWorkoutSession.type,
            startTime: currentWorkoutSession.startTime,
            currentExercise: nextExerciseIndex, // Save the NEXT exercise index
            exercises: currentWorkoutSession.exercises.map((ex, idx) => ({
              ...ex,
              completed: idx === currentExercise ? isCompleted : ex.completed,
              completedSets: idx === currentExercise ? completedCount : ex.completedSets,
              setProgress: idx === currentExercise ? currentExerciseSetProgress : ex.setProgress
            })),
            isInProgress: true,
            lastUpdated: new Date().toISOString()
          }
          
          await saveWorkoutSession(progressData)
        } catch (error) {
          console.error('Error saving workout progress:', error)
        } finally {
          setIsSaving(false)
        }
      }
      
      // Move to next exercise
      setCurrentExercise(nextExerciseIndex)
    }
  }

  const handleAnalyzer = () => {
    if (isMobile()) {
      // On mobile, show camera selection modal first
      setPendingExercise(exercise)
      setShowCameraModal(true)
    } else {
      // On desktop, proceed directly with default camera
      const analyzerPath = dayId
        ? `/workout/${category}/${splitId}/${dayId}/session/${exercise.id}/analyzer/${exercise.uniqueName}`
        : `/workout/${category}/${splitId}/session/${exercise.id}/analyzer/${exercise.uniqueName}`
      navigate(analyzerPath, {
        state: { cameraFacingMode: 'user' }
      })
    }
  }

  const handleCameraSelection = (facingMode) => {
    if (pendingExercise) {
      const analyzerPath = dayId
        ? `/workout/${category}/${splitId}/${dayId}/session/${pendingExercise.id}/analyzer/${pendingExercise.uniqueName}`
        : `/workout/${category}/${splitId}/session/${pendingExercise.id}/analyzer/${pendingExercise.uniqueName}`
      navigate(analyzerPath, {
        state: { cameraFacingMode: facingMode }
      })
    }
    setShowCameraModal(false)
    setPendingExercise(null)
  }

  const handleCameraModalClose = () => {
    setShowCameraModal(false)
    setPendingExercise(null)
  }

  const handleExitClick = () => {
    setShowExitConfirmation(true)
  }

  const handleExitConfirm = async () => {
    // Save as COMPLETED workout (not in-progress) with only completed exercises
    if (currentWorkoutSession) {
      setIsSaving(true)
      try {
        // Filter to only include exercises that have been completed or have completed sets
        const completedExercises = currentWorkoutSession.exercises.filter(ex => 
          ex.completed || (ex.completedSets && ex.completedSets > 0)
        )
        
        // Edge case: If no exercises completed, still save with empty array to track attempt
        
        // Calculate workout duration
        const startTime = new Date(currentWorkoutSession.startTime)
        const endTime = new Date()
        const duration = Math.round((endTime - startTime) / 60000) // minutes
        
        // Create exited workout data
        const exitedWorkoutData = {
          id: currentWorkoutSession.id,
          planName: currentWorkoutSession.planName,
          planId: currentWorkoutSession.planId,
          dayId: currentWorkoutSession.dayId,
          category: category,
          type: currentWorkoutSession.type,
          status: "exited", // Mark as exited (not completed)
          date: new Date(currentWorkoutSession.startTime).toISOString().slice(0, 10), // Add date field
          startTime: currentWorkoutSession.startTime,
          endTime: endTime.toISOString(),
          duration: duration,
          exercises: completedExercises, // Only completed exercises
          summary: {
            totalExercises: currentWorkoutSession.exercises.length,
            completedExercises: completedExercises.length,
            totalSets: completedExercises.reduce((sum, ex) => sum + (ex.sets || 0), 0)
          }
        }
        
        // Save as exited workout
        await saveWorkoutSession(exitedWorkoutData)
      } catch (error) {
        console.error('Error saving completed workout:', error)
        alert('Failed to save workout. Please try again.')
      } finally {
        setIsSaving(false)
      }
    }
    
    // Navigate back
    setShowExitConfirmation(false)
    navigate(`/workout/${category}/${splitId}`)
  }

  const handleExitCancel = () => {
    setShowExitConfirmation(false)
  }

  const getExerciseIcon = () => {
    if (exercise.isPose) return Heart
    if (category === 'calisthenics') return Users
    return Dumbbell
  }

  const getColorClasses = () => {
    if (exercise.isPose) {
      return {
        text: 'text-ar-green',
        bg: 'bg-ar-green',
        bgLight: 'bg-ar-green/20',
        hover: 'hover:bg-ar-green/80',
        shadow: 'hover:shadow-glow-green'
      }
    }
    if (category === 'calisthenics') {
      return {
        text: 'text-ar-violet',
        bg: 'bg-ar-violet',
        bgLight: 'bg-ar-violet/20',
        hover: 'hover:bg-ar-violet/80',
        shadow: 'hover:shadow-glow-violet'
      }
    }
    return {
      text: 'text-ar-blue',
      bg: 'bg-ar-blue',
      bgLight: 'bg-ar-blue/20',
      hover: 'hover:bg-ar-blue/80',
      shadow: 'hover:shadow-glow-blue'
    }
  }

  const ExerciseIcon = getExerciseIcon()
  const colors = getColorClasses()

  return (
    <div className="max-w-4xl mx-auto space-y-3 md:space-y-4 p-4 md:p-6 min-h-screen flex flex-col justify-center">
      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card p-6 rounded-2xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold mb-3">Exit Workout?</h3>
              <p className="text-ar-gray mb-6">
                Your progress will be saved and you can resume this workout later from where you left off.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleExitCancel}
                  className="flex-1 bg-ar-dark-gray hover:bg-ar-dark-gray/80 text-white font-bold py-3 rounded-xl transition-all duration-300"
                >
                  Continue Workout
                </button>
                <button
                  onClick={handleExitConfirm}
                  className="flex-1 bg-ar-red hover:bg-ar-red/80 text-white font-bold py-3 rounded-xl transition-all duration-300"
                >
                  Exit & Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar with Exit Button */}
      <motion.div
        className="glass-card p-3 md:p-4 rounded-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-1 md:mb-2">
          <span className="text-ar-gray">Progress</span>
          <div className="flex items-center gap-3">
            <span className={`${colors.text} font-bold`}>
              {currentExercise + 1} / {sessionData.exercises.length}
            </span>
            <button
              onClick={handleExitClick}
              className="p-1.5 rounded-full bg-ar-dark-gray/50 hover:bg-ar-dark-gray/70 transition-colors duration-200 backdrop-blur-sm"
              aria-label="Exit workout session"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-ar-gray hover:text-white transition-colors" />
            </button>
          </div>
        </div>
        <div className="w-full bg-ar-dark-gray rounded-full h-3">
          <motion.div
            className={`${colors.bg} h-3 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentExercise + 1) / sessionData.exercises.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Exercise Display */}
      <motion.div
        className="glass-card p-3 md:p-4 rounded-2xl text-center"
        key={currentExercise}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Exercise Animation */}
        <div className={`w-64 h-96 md:w-72 md:h-[28rem] mx-auto mb-3 md:mb-4 ${colors.bgLight} rounded-2xl overflow-hidden`}>
          <div className="w-full h-full flex items-center justify-center">
            {exercise.video ? (
              <video
                src={exercise.video}
                autoPlay
                loop
                playsInline
                muted
                className="w-full h-full object-cover rounded-xl bg-black"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-ar-gray">
                Video not available
              </div>
            )}
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{exercise.exerciseName}</h2>
        <p className={`${colors.text} text-lg md:text-xl font-bold mb-1`}>
          {exercise.sets ? `${exercise.sets} sets × ${exercise.reps} reps` : exercise.reps}
        </p>
        {exercise.description && (
          <p className="text-ar-gray mb-3 md:mb-4">{exercise.description}</p>
        )}

        {/* Set Tracking Circles - Only show for exercises with sets */}
        {exercise.sets && (
          <div className="mb-4 md:mb-6">
            <p className="text-sm text-ar-gray mb-3">Track your sets:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {Array.from({ length: parseInt(exercise.sets) || 3 }, (_, index) => {
                const setDetails = getSetDetails(currentExercise, index)
                const isCompleted = setDetails.completed
                const actualReps = setDetails.actualReps
                
                // Check if this set can be clicked (sequential validation)
                let isClickable = true
                if (index > 0) {
                  const previousSetData = completedSets[`${currentExercise}-${index - 1}`]
                  const isPreviousCompleted = previousSetData && (previousSetData === true || previousSetData.completed)
                  isClickable = isPreviousCompleted
                }
                
                return (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <motion.button
                      onClick={() => handleSetClick(currentExercise, index)}
                      disabled={!isClickable && !isCompleted}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-bold ${
                        isCompleted
                          ? `${colors.bg} border-transparent text-white shadow-lg`
                          : isClickable
                          ? `border-ar-gray-600 text-ar-gray-400 hover:border-ar-blue/50 hover:text-ar-blue cursor-pointer`
                          : `border-ar-gray-800 text-ar-gray-600 cursor-not-allowed opacity-50`
                      }`}
                      whileHover={isClickable || isCompleted ? { scale: 1.05 } : {}}
                      whileTap={isClickable || isCompleted ? { scale: 0.95 } : {}}
                    >
                      {index + 1}
                    </motion.button>
                    {isCompleted && actualReps !== null && (
                      <span className={`text-xs ${colors.text} font-medium`}>
                        {actualReps}/{exercise.reps}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-ar-gray mt-2">
              {getCompletedSetsCount(currentExercise)} of {exercise.sets} sets completed
              {isSaving && <span className="ml-2 text-ar-blue">• Saving...</span>}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 md:gap-3 justify-center px-4 md:px-0">
          {exercise.pose_analyzer && (
            <button
              onClick={handleAnalyzer}
              className="w-full bg-ar-violet hover:bg-ar-violet/80 text-white font-bold py-3 md:py-4 rounded-xl transition-all duration-300 hover:shadow-glow-violet"
            >
              <div className="flex items-center justify-center gap-2">
                <Camera size={18} className="md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Form Analyzer</span>
              </div>
            </button>
          )}
          
          <button
            onClick={handleNext}
            className={`w-full ${colors.bg} ${colors.hover} text-white font-bold py-3 md:py-4 rounded-xl transition-all duration-300 ${colors.shadow}`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle size={18} className="md:w-5 md:h-5" />
              <span className="text-sm md:text-base">
                {getCompletedSetsCount(currentExercise) > 0 && exercise.sets
                  ? `Continue (${getCompletedSetsCount(currentExercise)}/${exercise.sets} sets)`
                  : isLastExercise 
                  ? 'Finish Session' 
                  : exercise.isStretch || exercise.isPose
                  ? 'Next Stretch'
                  : 'Next Exercise'}
              </span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Camera Selection Modal */}
      <CameraSelectionModal
        isOpen={showCameraModal}
        onClose={handleCameraModalClose}
        onSelect={handleCameraSelection}
      />

      {/* Rep Input Modal */}
      <RepInputModal
        isOpen={showRepModal}
        onClose={handleRepModalClose}
        onSave={handleRepSave}
        targetReps={exercise?.reps || 0}
        currentReps={selectedSet ? getSetDetails(selectedSet.exerciseIndex, selectedSet.setIndex).actualReps : null}
        setNumber={selectedSet ? selectedSet.setIndex + 1 : 0}
        exerciseName={exercise?.exerciseName || ''}
      />
    </div>
  )
}