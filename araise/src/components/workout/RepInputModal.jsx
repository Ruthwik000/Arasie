import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"

/**
 * RepInputModal - Modal for entering/editing actual reps completed for a set
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Callback when modal is closed without saving
 * @param {function} onSave - Callback when reps are saved (receives reps number)
 * @param {number} targetReps - The prescribed number of reps for this set
 * @param {number} currentReps - Current rep count (for editing existing sets)
 * @param {number} setNumber - The set number (1, 2, 3, etc.)
 * @param {string} exerciseName - Name of the exercise
 */
export default function RepInputModal({
  isOpen,
  onClose,
  onSave,
  targetReps,
  currentReps = null,
  setNumber,
  exerciseName
}) {
  const [reps, setReps] = useState("")
  const [error, setError] = useState("")

  // Initialize input with current reps when editing
  useEffect(() => {
    if (isOpen) {
      setReps(currentReps !== null ? String(currentReps) : "")
      setError("")
    }
  }, [isOpen, currentReps])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      
      if (e.key === "Escape") {
        handleClose()
      } else if (e.key === "Enter" && !error) {
        handleSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, reps, error])

  const validateInput = (value) => {
    if (value === "") {
      setError("")
      return true
    }

    const numValue = parseInt(value, 10)
    
    // Check if it's a valid number
    if (isNaN(numValue) || !/^\d+$/.test(value)) {
      setError("Please enter a valid number")
      return false
    }

    // Check if it's positive
    if (numValue < 0) {
      setError("Reps must be positive")
      return false
    }

    // Check maximum value
    if (numValue > 999) {
      setError("Maximum 999 reps")
      return false
    }

    setError("")
    return true
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setReps(value)
    validateInput(value)
  }

  const handleSave = () => {
    if (reps === "") {
      // Empty input means mark as incomplete
      onSave(null)
      handleClose()
      return
    }

    const numReps = parseInt(reps, 10)
    if (validateInput(reps) && !isNaN(numReps)) {
      onSave(numReps)
      handleClose()
    }
  }

  const handleClose = () => {
    setReps("")
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="glass-card p-6 rounded-2xl max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{exerciseName}</h3>
              <p className="text-ar-gray text-sm">
                Set {setNumber} • Target: {targetReps} reps
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-ar-dark-gray/50 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-ar-gray" />
            </button>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label htmlFor="reps-input" className="block text-sm font-medium mb-2">
              How many reps did you complete?
            </label>
            <input
              id="reps-input"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={reps}
              onChange={handleInputChange}
              placeholder={`Enter reps (target: ${targetReps})`}
              className={`w-full px-4 py-3 bg-ar-dark-gray rounded-xl text-white text-lg font-bold text-center focus:outline-none focus:ring-2 ${
                error ? "focus:ring-ar-red ring-2 ring-ar-red" : "focus:ring-ar-blue"
              }`}
              autoFocus
              min="0"
              max="999"
            />
            {error && (
              <p className="text-ar-red text-sm mt-2">{error}</p>
            )}
            {reps === "" && !error && (
              <p className="text-ar-gray text-xs mt-2">
                Leave empty to mark set as incomplete
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-ar-dark-gray hover:bg-ar-dark-gray/80 text-white font-bold py-3 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!!error}
              className={`flex-1 font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                error
                  ? "bg-ar-dark-gray/50 text-ar-gray cursor-not-allowed"
                  : "bg-ar-blue hover:bg-ar-blue/80 text-white hover:shadow-glow-blue"
              }`}
            >
              <Check className="w-5 h-5" />
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
