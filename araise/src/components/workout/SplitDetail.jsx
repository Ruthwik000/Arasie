import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Clock,
  Target,
  Play,
  Heart
} from "lucide-react"
import { workoutData } from "../../data/workoutData"
import { useUserStore } from "../../store/userStore"

// Split Detail Component
export default function SplitDetail() {
  const { category, splitId } = useParams()
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

  const handleStartNewWorkout = async (dayId = null) => {
    // Clear saved progress and start fresh
    const { clearWorkoutProgress } = useUserStore.getState()
    await clearWorkoutProgress()
    setSavedProgress(null)
    
    if (dayId) {
      navigate(`/workout/${category}/${splitId}/${dayId}/session`)
    } else {
      navigate(`/workout/${category}/${splitId}/session`)
    }
  }

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
    return <div className="text-center text-ar-gray">Split not found</div>
  }

  // Handle different workout structures
  const isSequenceBased = split.sequence
  const isExerciseBased = split.exercises && !split.days
  const days = isSequenceBased || isExerciseBased ? null : Object.entries(split.days || {})

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 min-h-screen">
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => navigate(`/workout/${category}`)}
          className="w-12 h-12 glass-card rounded-xl hover:border-ar-blue/50 transition-all duration-300 flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-ar-blue" />
        </button>
        <div>
          <h1 className="text-4xl font-bold">{split.name}</h1>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2 text-ar-blue">
              <Clock size={16} />
              <span>{split.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-ar-violet">
              <Target size={16} />
              <span>{split.type}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Exercise-based (Stretching with exercises array) */}
      {isExerciseBased && (
        <motion.div
          className="glass-card p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Exercises</h2>
          <div className="space-y-4 mb-8">
            {split.exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                className="p-4 bg-ar-dark-gray/30 rounded-xl border border-ar-green/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-ar-white mb-2">
                      {index + 1}. {exercise.name}
                    </h3>
                    <p className="text-ar-green font-medium mb-1">
                      {exercise.duration}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-ar-green/20 rounded-lg flex items-center justify-center">
                    <Heart className="text-ar-green" size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={handleStartNewWorkout}
            className="w-full bg-ar-green hover:bg-ar-green/80 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-glow-green text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Play size={20} />
              Begin Session
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Sequence-based (Yoga with sequence array) */}
      {isSequenceBased && (
        <motion.div
          className="glass-card p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Sequence</h2>
          <div className="space-y-4 mb-8">
            {split.sequence.map((pose, index) => (
              <motion.div
                key={index}
                className="p-4 bg-ar-dark-gray/30 rounded-xl border border-ar-green/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-ar-white mb-2">
                      {index + 1}. {pose.pose}
                    </h3>
                    <p className="text-ar-green font-medium mb-1">
                      {pose.duration}
                    </p>
                    <p className="text-ar-gray text-sm">
                      {pose.description}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-ar-green/20 rounded-lg flex items-center justify-center">
                    <Heart className="text-ar-green" size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={handleStartNewWorkout}
            className="w-full bg-ar-green hover:bg-ar-green/80 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-glow-green text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Play size={20} />
              Begin Session
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Day-based (Gym/Calisthenics) */}
      {!isSequenceBased && days && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map(([dayKey, dayData], index) => (
            <motion.div
              key={dayKey}
              className="glass-card p-4 rounded-xl cursor-pointer transition-all duration-300 hover:border-ar-blue/50"
              onClick={() => navigate(`/workout/${category}/${splitId}/${dayKey}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-bold mb-2">{dayData.splitDay || dayData.name}</h3>
              <p className="text-ar-gray text-sm mb-3">
                {dayData.exercises.length} exercises
              </p>
              <div className="text-ar-blue text-sm font-medium">
                Continue →
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}