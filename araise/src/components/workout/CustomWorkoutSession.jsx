import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle, 
  Camera, 
  Dumbbell,
  X
} from "lucide-react"
import CameraSelectionModal from "../CameraSelectionModal"
import RepInputModal from "./RepInputModal"
import { isMobile } from "../../utils/helpers"
import { useUserStore } from "../../store/userStore"

// Custom Workout Session Component - Matches WorkoutSession.jsx exactly
export default function CustomWorkoutSession() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const [currentExercise, setCurrentExercise] = useState(0)
  const [workout, setWorkout] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
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
    customWorkouts,
    loadCustomWorkouts,
    startWorkoutSession, 
    updateExerciseInSession, 
    currentWorkoutSession,
    saveWorkoutSession,
    loadWorkoutProgress,
    clearWorkoutProgress
  } = useUserStore()

  // Clear any stale workout session when component mounts
  useEffect(() => {
    console.log('[CustomWorkoutSession] Component mounted, currentWorkoutSession:', currentWorkoutSession)
    
    // If there's a current session but it's completed or for a different workout, clear it
    if (currentWorkoutSession) {
      const isForThisWorkout = currentWorkoutSession.planId === `custom-${workoutId}`
      const isCompleted = currentWorkoutSession.status === 'completed' || currentWorkoutSession.completed === true
      
      if (!isForThisWorkout || isCompleted) {
        console.log('[CustomWorkoutSession] Clearing stale session:', { isForThisWorkout, isCompleted })
        // Clear both Firebase and local state
        clearWorkoutProgress().then(() => {
          console.log('[CustomWorkoutSession] Stale session cleared from Firebase')
        })
      }
    }
    
    return () => {
      console.log('[CustomWorkoutSession] Component unmounting')
    }
  }, []) // Only run on mount

  // Load custom workout
  useEffect(() => {
    const loadWorkout = async () => {
      setIsLoading(true)
      try {
        await loadCustomWorkouts()
        const foundWorkout = customWorkouts.find(w => w.id === parseInt(workoutId))
        setWorkout(foundWorkout)
      } catch (error) {
        console.error('Error loading workout:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadWorkout()
  }, [workoutId, loadCustomWorkouts])

  // Also check when customWorkouts updates
  useEffect(() => {
    if (customWorkouts.length > 0) {
      const foundWorkout = customWorkouts.find(w => w.id === parseInt(workoutId))
      setWorkout(foundWorkout)
      setIsLoading(false)
    }
  }, [customWorkouts, workoutId])

  // Initialize workout session when workout is loaded (only once per workout)
  useEffect(() => {
    const initializeWorkout = async () => {
      // Only initialize if we have a workout loaded
      if (!workout) {
        console.log('[CustomWorkoutSession] No workout loaded yet')
        return
      }
      
      console.log('[CustomWorkoutSession] Initializing workout, checking for saved progress...')
      console.log('[CustomWorkoutSession] Current session in store:', currentWorkoutSession)
      
      // Check if there's already a session for THIS specific workout
      const hasSessionForThisWorkout = currentWorkoutSession && 
                                       currentWorkoutSession.planId === `custom-${workout.id}`
      
      if (hasSessionForThisWorkout) {
        console.log('[CustomWorkoutSession] Session already exists for this workout, using it')
        return
      }
      
      // Try to load saved progress from Firebase
      const savedProgress = await loadWorkoutProgress(`custom-${workout.id}`, null)
      
      if (savedProgress && savedProgress.isInProgress !== false && savedProgress.status !== 'completed') {
        // Only resume if it's actually in progress (not completed)
        console.log('[CustomWorkoutSession] Found in-progress workout, resuming:', savedProgress)
        setWorkoutSession(savedProgress)
        return
      }
      
      if (savedProgress) {
        console.log('[CustomWorkoutSession] Found completed/stale workout, starting fresh')
      } else {
        console.log('[CustomWorkoutSession] No saved progress found, starting new session')
      }
      
      // Start new workout session
      const workoutPlan = {
        planName: workout.name,
        planId: `custom-${workout.id}`,
        dayId: null,
        type: "custom",
        exercises: workout.exercises.map(exercise => {
          const actualName = exercise.name || exercise.exerciseName || 'Exercise';
          
          return {
            ...exercise,
            exerciseName: actualName,
            name: actualName,
            video: exercise.video || null,
            primaryMuscle: exercise.primaryMuscle || 'Full Body',
            secondaryMuscles: exercise.secondaryMuscles || [],
            equipment: exercise.equipment || 'None',
            difficulty: exercise.difficulty || 'Intermediate',
            description: exercise.description || '',
            pose_analyzer: exercise.pose_analyzer || { used: false },
            completed: false,
            completedSets: 0,
            totalSets: parseInt(exercise.sets) || parseInt(exercise.customSets) || 3,
            sets: parseInt(exercise.sets) || parseInt(exercise.customSets) || 3,
            reps: exercise.reps || exercise.customReps || '8-12',
            setProgress: {}
          };
        })
      }
      
      const session = startWorkoutSession(workoutPlan)
      console.log('[CustomWorkoutSession] Started new session:', session)
      setWorkoutSession(session)
    }
    
    initializeWorkout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout]) // Only depend on workout to initialize once per workout load

  // Load saved progress when currentWorkoutSession updates
  useEffect(() => {
    if (currentWorkoutSession && currentWorkoutSession.exercises) {
      // Restore completed sets from saved session
      const savedSets = {}
      currentWorkoutSession.exercises.forEach((exercise, exerciseIndex) => {
        if (exercise.setProgress) {
          Object.keys(exercise.setProgress).forEach(setIndex => {
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

  if (isLoading) {
    return <div className="text-center text-ar-gray">Loading workout...</div>
  }

  if (!workout) {
    return <div className="text-center text-ar-gray">Workout not found</div>
  }

  const exercise = workout.exercises[currentExercise]
  const isLastExercise = currentExercise === workout.exercises.length - 1

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
    if (setIndex > 0) {
      const previousSetData = completedSets[`${exerciseIndex}-${setIndex - 1}`]
      const isPreviousCompleted = previousSetData && (previousSetData === true || previousSetData.completed)
      
      if (!isPreviousCompleted) {
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
        ? null
        : { completed: true, actualReps }
    }
    
    setCompletedSets(newCompletedSets)
    
    // Calculate completed sets count for this exercise
    const totalSets = parseInt(exercise.sets) || parseInt(exercise.customSets) || 3
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
      setProgress: exerciseSetProgress
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
        isInProgress: true,
        lastUpdated: new Date().toISOString()
      }
      
      await saveWorkoutSession(progressData)
    } catch (error) {
      console.error('Error saving workout progress:', error)
      alert('Failed to save workout progress. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getCompletedSetsCount = (exerciseIndex) => {
    const totalSets = parseInt(exercise.sets) || parseInt(exercise.customSets) || 3
    let completed = 0
    for (let i = 0; i < totalSets; i++) {
      const setData = completedSets[`${exerciseIndex}-${i}`]
      if (setData && (setData === true || setData.completed)) {
        completed++
      }
    }
    return completed
  }

  const isExerciseComplete = (exerciseIndex) => {
    const totalSets = parseInt(exercise.sets) || parseInt(exercise.customSets) || 3
    return getCompletedSetsCount(exerciseIndex) === totalSets
  }

  const handleNext = async () => {
    if (isLastExercise) {
      // Save the workout with actual rep data before navigating to complete page
      if (currentWorkoutSession) {
        setIsSaving(true)
        try {
          const startTime = new Date(currentWorkoutSession.startTime)
          const endTime = new Date()
          const duration = Math.round((endTime - startTime) / 60000)
          
          // Calculate summary with actual data
          let totalSetsRequired = 0
          let totalSetsCompleted = 0
          
          currentWorkoutSession.exercises.forEach(exercise => {
            const targetSets = parseInt(exercise.sets) || parseInt(exercise.customSets) || 3
            totalSetsRequired += targetSets
            totalSetsCompleted += exercise.completedSets || 0
          })
          
          const completedWorkoutData = {
            id: currentWorkoutSession.id,
            planName: currentWorkoutSession.planName,
            planId: currentWorkoutSession.planId,
            dayId: currentWorkoutSession.dayId,
            category: "custom",
            type: currentWorkoutSession.type,
            status: "completed",
            completed: true,
            date: new Date(currentWorkoutSession.startTime).toISOString().slice(0, 10),
            startTime: currentWorkoutSession.startTime,
            endTime: endTime.toISOString(),
            duration: duration,
            exercises: currentWorkoutSession.exercises.map(ex => ({
              ...ex,
              completed: true
            })),
            summary: {
              totalExercises: currentWorkoutSession.exercises.length,
              completedExercises: currentWorkoutSession.exercises.filter(ex => ex.completed || (ex.completedSets && ex.completedSets > 0)).length,
              totalSets: totalSetsRequired,
              completedSets: totalSetsCompleted,
              completionPercentage: totalSetsRequired > 0 ? Math.round((totalSetsCompleted / totalSetsRequired) * 100) : 0
            }
          }
          
          console.log('[CustomWorkoutSession] Clearing workout progress FIRST...')
          await clearWorkoutProgress()
          console.log('[CustomWorkoutSession] Progress cleared, now saving completed workout:', completedWorkoutData)
          
          await saveWorkoutSession(completedWorkoutData)
          console.log('[CustomWorkoutSession] Workout saved successfully')
        } catch (error) {
          console.error('[CustomWorkoutSession] Error saving completed workout:', error)
          alert('Failed to save workout. Please try again.')
          return // Don't navigate if save failed
        } finally {
          setIsSaving(false)
        }
      }
      
      console.log('[CustomWorkoutSession] Navigating to completion page')
      navigate(`/workout/custom/${workoutId}/complete`)
    } else {
      // Save current exercise progress AND update to next exercise
      const nextExerciseIndex = currentExercise + 1
      if (currentWorkoutSession) {
        const completedCount = getCompletedSetsCount(currentExercise)
        const isCompleted = isExerciseComplete(currentExercise)
        
        const totalSets = parseInt(exercise.sets) || parseInt(exercise.customSets) || 3
        const currentExerciseSetProgress = {}
        for (let i = 0; i < totalSets; i++) {
          const key = `${currentExercise}-${i}`
          if (completedSets[key]) {
            currentExerciseSetProgress[i] = completedSets[key]
          }
        }
        
        setIsSaving(true)
        try {
          const progressData = {
            id: currentWorkoutSession.id,
            planName: currentWorkoutSession.planName,
            planId: currentWorkoutSession.planId,
            dayId: currentWorkoutSession.dayId,
            type: currentWorkoutSession.type,
            startTime: currentWorkoutSession.startTime,
            currentExercise: nextExerciseIndex,
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
      
      setCurrentExercise(nextExerciseIndex)
    }
  }

  const handleAnalyzer = () => {
    if (isMobile()) {
      setPendingExercise(exercise)
      setShowCameraModal(true)
    } else {
      navigate(`/workout/custom/${workoutId}/session/${exercise.id}/analyzer/${exercise.exerciseName}`, {
        state: { cameraFacingMode: 'user' }
      })
    }
  }

  const handleCameraSelection = (facingMode) => {
    if (pendingExercise) {
      navigate(`/workout/custom/${workoutId}/session/${pendingExercise.id}/analyzer/${pendingExercise.exerciseName}`, {
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
    if (currentWorkoutSession) {
      setIsSaving(true)
      try {
        const completedExercises = currentWorkoutSession.exercises.filter(ex => 
          ex.completed || (ex.completedSets && ex.completedSets > 0)
        )
        
        let totalSetsRequired = 0
        let totalSetsCompleted = 0
        
        currentWorkoutSession.exercises.forEach(exercise => {
          if (exercise.sets) {
            const targetSets = parseInt(exercise.sets) || 0
            totalSetsRequired += targetSets
            totalSetsCompleted += exercise.completedSets || 0
          } else {
            totalSetsRequired += 1
            totalSetsCompleted += exercise.completed ? 1 : 0
          }
        })
        
        const isFullyCompleted = totalSetsRequired > 0 && totalSetsCompleted >= totalSetsRequired
        
        const startTime = new Date(currentWorkoutSession.startTime)
        const endTime = new Date()
        const duration = Math.round((endTime - startTime) / 60000)
        
        const workoutData = {
          id: currentWorkoutSession.id,
          planName: currentWorkoutSession.planName,
          planId: currentWorkoutSession.planId,
          dayId: currentWorkoutSession.dayId,
          category: "custom",
          type: currentWorkoutSession.type,
          status: isFullyCompleted ? "completed" : "exited",
          date: new Date(currentWorkoutSession.startTime).toISOString().slice(0, 10),
          startTime: currentWorkoutSession.startTime,
          endTime: endTime.toISOString(),
          duration: duration,
          exercises: currentWorkoutSession.exercises,
          summary: {
            totalExercises: currentWorkoutSession.exercises.length,
            completedExercises: completedExercises.length,
            totalSets: totalSetsRequired,
            completedSets: totalSetsCompleted
          }
        }
        
        await saveWorkoutSession(workoutData)
      } catch (error) {
        console.error('Error saving workout:', error)
        alert('Failed to save workout. Please try again.')
      } finally {
        setIsSaving(false)
      }
    }
    
    setShowExitConfirmation(false)
    navigate(`/workout/custom/my-workouts`)
  }

  const handleExitCancel = () => {
    setShowExitConfirmation(false)
  }

  const colors = {
    text: 'text-ar-violet',
    bg: 'bg-ar-violet',
    bgLight: 'bg-ar-violet/20',
    hover: 'hover:bg-ar-violet/80',
    shadow: 'hover:shadow-glow-violet'
  }

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
              {currentExercise + 1} / {workout.exercises.length}
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
            animate={{ width: `${((currentExercise + 1) / workout.exercises.length) * 100}%` }}
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
        {/* Exercise Video */}
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
                <Dumbbell size={64} className="text-ar-violet" />
              </div>
            )}
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{exercise.exerciseName || exercise.name}</h2>
        <p className={`${colors.text} text-lg md:text-xl font-bold mb-1`}>
          {exercise.sets ? `${exercise.sets} sets × ${exercise.reps} reps` : exercise.reps}
        </p>
        {exercise.primaryMuscle && (
          <p className="text-ar-gray mb-3 md:mb-4">
            {exercise.primaryMuscle} • {exercise.difficulty || 'Standard'}
          </p>
        )}

        {/* Set Tracking Circles */}
        {exercise.sets && (
          <div className="mb-4 md:mb-6">
            <p className="text-sm text-ar-gray mb-3">Track your sets:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {Array.from({ length: parseInt(exercise.sets) || parseInt(exercise.customSets) || 3 }, (_, index) => {
                const setDetails = getSetDetails(currentExercise, index)
                const isCompleted = setDetails.completed
                const actualReps = setDetails.actualReps
                
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
                          ? `border-ar-gray-600 text-ar-gray-400 hover:border-ar-violet/50 hover:text-ar-violet cursor-pointer`
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
              {getCompletedSetsCount(currentExercise)} of {exercise.sets || exercise.customSets} sets completed
              {isSaving && <span className="ml-2 text-ar-violet">• Saving...</span>}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 md:gap-3 justify-center px-4 md:px-0">
          {exercise.pose_analyzer && (
            <button
              onClick={handleAnalyzer}
              className="w-full bg-ar-blue hover:bg-ar-blue/80 text-white font-bold py-3 md:py-4 rounded-xl transition-all duration-300 hover:shadow-glow-blue"
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
                  ? `Continue (${getCompletedSetsCount(currentExercise)}/${exercise.sets || exercise.customSets} sets)`
                  : isLastExercise 
                  ? 'Finish Session' 
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
        targetReps={exercise?.reps || exercise?.customReps || 0}
        currentReps={selectedSet ? getSetDetails(selectedSet.exerciseIndex, selectedSet.setIndex).actualReps : null}
        setNumber={selectedSet ? selectedSet.setIndex + 1 : 0}
        exerciseName={exercise?.exerciseName || exercise?.name || ''}
      />
    </div>
  )
}
