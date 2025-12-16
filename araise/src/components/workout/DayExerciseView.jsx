import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Play,
  Dumbbell,
  Camera
} from "lucide-react"
import { workoutData } from "../../data/workoutData"
import { useUserStore } from "../../store/userStore"

export default function DayExerciseView() {
  const { category, splitId, dayId } = useParams()
  const navigate = useNavigate()
  const [savedProgress, setSavedProgress] = useState(null)
  const { loadWorkoutProgress } = useUserStore()

  // Check for saved workout progress on mount
  useEffect(() => {
    const checkSavedProgress = async () => {
      const progress = await loadWorkoutProgress(splitId)
      if (progress) {
        setSavedProgress(progress)
      }
    }
    checkSavedProgress()
  }, [splitId, loadWorkoutProgress])

  const getSplitData = () => {
    switch (category) {
      case 'gym':
        return workoutData.gym[splitId]
      case 'calisthenics':
        return workoutData.calisthenics[splitId]
      case 'stretching':
        return workoutData.stretching[splitId]
      default:
        return null
    }
  }

  const split = getSplitData()

  if (!split) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 min-h-screen">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/workout/${category}`)}
            className="w-12 h-12 glass-card rounded-xl hover:border-ar-blue/50 transition-all duration-300 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-ar-blue" />
          </button>
          <h1 className="text-2xl font-bold text-ar-gray">Split not found</h1>
        </div>
      </div>
    )
  }

  const dayData = split.days?.[dayId]

  if (!dayData) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 min-h-screen">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/workout/${category}/${splitId}`)}
            className="w-12 h-12 glass-card rounded-xl hover:border-ar-blue/50 transition-all duration-300 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-ar-blue" />
          </button>
          <h1 className="text-2xl font-bold text-ar-gray">Day not found</h1>
        </div>
      </div>
    )
  }

  const handleStartWorkout = async () => {
    // Clear saved progress and start fresh
    const { clearWorkoutProgress } = useUserStore.getState()
    await clearWorkoutProgress()
    setSavedProgress(null)
    
    navigate(`/workout/${category}/${splitId}/${dayId}/session`)
  }

  const handleBack = () => {
    navigate(`/workout/${category}/${splitId}`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 min-h-screen">
      {/* Header with Back Button */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={handleBack}
          className="w-12 h-12 glass-card rounded-xl hover:border-ar-blue/50 transition-all duration-300 flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-ar-blue" />
        </button>
        <div>
          <h1 className="text-4xl font-bold">{dayData.splitDay || dayData.name}</h1>
          <p className="text-ar-gray mt-1">{dayData.exercises.length} exercises</p>
        </div>
      </motion.div>

      {/* Begin Button */}
      <motion.button
        onClick={handleStartWorkout}
        className="w-full bg-ar-blue hover:bg-ar-blue/80 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-glow-blue text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-center gap-2">
          <Play size={20} />
          Begin {dayData.splitDay || dayData.name}
        </div>
      </motion.button>

      {/* Exercise List */}
      <motion.div
        className="glass-card p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-6">Exercises</h2>
        <div className="space-y-4">
          {dayData.exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              className="p-4 bg-ar-dark-gray/30 rounded-xl border border-ar-blue/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ar-white mb-2">
                    {index + 1}. {exercise.exerciseName}
                  </h3>
                  <p className="text-ar-blue font-medium mb-1">
                    {exercise.sets} sets × {exercise.reps} reps
                  </p>
                  <p className="text-ar-gray text-sm mb-2">
                    {exercise.description}
                  </p>
                  {exercise.pose_analyzer && (
                    <div className="flex items-center gap-2 text-ar-violet text-sm">
                      <Camera size={14} />
                      <span>AI Form Analysis Available</span>
                    </div>
                  )}
                </div>
                <div className="w-16 h-16 bg-ar-blue/20 rounded-lg flex items-center justify-center">
                  <Dumbbell className="text-ar-blue" size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
