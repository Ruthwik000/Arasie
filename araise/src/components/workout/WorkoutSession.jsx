import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
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
  
  const { 
    startWorkoutSession, 
    updateExerciseInSession, 
    currentWorkoutSession,
    saveWorkoutSession 
  } = useUserStore()
  
  const getSessionData = () => {
    const splitData = workoutData[category]?.[splitId]
    if (!splitData) return null
    
    // Handle sequence-based (stretching & yoga)
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
        name: splitData.days[dayId].splitDay,
        exercises: splitData.days[dayId].exercises
      }
    }
    
    return null
  }

  const sessionData = getSessionData()

  // Initialize workout session when component mounts
  useEffect(() => {
    if (sessionData && !currentWorkoutSession) {
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
  }, [sessionData, currentWorkoutSession, startWorkoutSession, category, splitId, dayId])

  // Load saved progress when currentWorkoutSession updates
  useEffect(() => {
    if (currentWorkoutSession && currentWorkoutSession.exercises) {
      // Restore completed sets from saved session
      const savedSets = {}
      currentWorkoutSession.exercises.forEach((exercise, exerciseIndex) => {
        if (exercise.setProgress) {
          Object.keys(exercise.setProgress).forEach(key => {
            savedSets[key] = exercise.setProgress[key]
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

  const handleSetComplete = (exerciseIndex, setIndex) => {
    const key = `${exerciseIndex}-${setIndex}`
    const newCompletedSets = {
      ...completedSets,
      [key]: !completedSets[key]
    }
    setCompletedSets(newCompletedSets)
    
    // Calculate completed sets count for this exercise
    const totalSets = parseInt(exercise.sets) || 3
    let completedCount = 0
    for (let i = 0; i < totalSets; i++) {
      if (newCompletedSets[`${exerciseIndex}-${i}`]) {
        completedCount++
      }
    }
    
    // Update exercise in session with real-time saving
    const isExerciseCompleted = completedCount === totalSets
    updateExerciseInSession(exerciseIndex, {
      completedSets: completedCount,
      completed: isExerciseCompleted,
      setProgress: newCompletedSets // Save the detailed set progress
    })
    
    // Auto-save progress to Firebase
    saveWorkoutProgress(exerciseIndex, completedCount, isExerciseCompleted, newCompletedSets)
  }

  const saveWorkoutProgress = async (exerciseIndex, completedSets, isCompleted, setProgress) => {
    if (!currentWorkoutSession) return
    
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
    } finally {
      setIsSaving(false)
    }
  }

  const getCompletedSetsCount = (exerciseIndex) => {
    const totalSets = parseInt(exercise.sets) || 3
    let completed = 0
    for (let i = 0; i < totalSets; i++) {
      if (completedSets[`${exerciseIndex}-${i}`]) {
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
    // Save current exercise progress before moving to next
    if (currentWorkoutSession) {
      const completedCount = getCompletedSetsCount(currentExercise)
      const isCompleted = isExerciseComplete(currentExercise)
      await saveWorkoutProgress(currentExercise, completedCount, isCompleted, completedSets)
    }
    
    if (isLastExercise) {
      const completePath = dayId 
        ? `/workout/${category}/${splitId}/${dayId}/complete`
        : `/workout/${category}/${splitId}/complete`
      navigate(completePath)
    } else {
      setCurrentExercise(currentExercise + 1)
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
      {/* Exit Button */}
      <motion.div
        className="flex justify-end mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => navigate(`/workout/${category}/${splitId}`)}
          className="p-2 rounded-full bg-ar-dark-gray/50 hover:bg-ar-dark-gray/70 transition-colors duration-200 backdrop-blur-sm"
          aria-label="Exit workout session"
        >
          <X className="w-5 h-5 text-ar-gray hover:text-white transition-colors" />
        </button>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="glass-card p-3 md:p-4 rounded-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-1 md:mb-2">
          <span className="text-ar-gray">Progress</span>
          <span className={`${colors.text} font-bold`}>
            {currentExercise + 1} / {sessionData.exercises.length}
          </span>
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
        <p className="text-ar-gray mb-3 md:mb-4">{exercise.description}</p>

        {/* Set Tracking Circles - Only show for exercises with sets */}
        {exercise.sets && (
          <div className="mb-4 md:mb-6">
            <p className="text-sm text-ar-gray mb-3">Track your sets:</p>
            <div className="flex justify-center gap-3">
              {Array.from({ length: parseInt(exercise.sets) || 3 }, (_, index) => {
                const isCompleted = completedSets[`${currentExercise}-${index}`]
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleSetComplete(currentExercise, index)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-bold ${
                      isCompleted
                        ? `${colors.bg} border-transparent text-white shadow-lg`
                        : `border-ar-gray-600 text-ar-gray-400 hover:border-ar-blue/50 hover:text-ar-blue`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {index + 1}
                  </motion.button>
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
    </div>
  )
}