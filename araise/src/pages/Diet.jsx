import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Utensils, Plus, Camera, Clock, Target, TrendingUp, Upload, X, Check } from "lucide-react"
import { useUserStore } from "../store/userStore"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function Diet() {
  const [showMealModal, setShowMealModal] = useState(false)
  const [showFoodScanModal, setShowFoodScanModal] = useState(false)
  const [showScanOptions, setShowScanOptions] = useState(false)
  const [showScanResults, setShowScanResults] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const [mealForm, setMealForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: ""
  })

  const {
    dietCalories,
    meals,
    dietGoalMet,
    logMeal
  } = useUserStore()

  const dailyCalorieGoal = 2000 // Could be customizable
  const progressPercentage = Math.min((dietCalories / dailyCalorieGoal) * 100, 100)

  // Calculate macros totals
  const macros = meals.reduce((acc, meal) => {
    acc.protein += meal.protein || 0
    acc.carbs += meal.carbs || 0
    acc.fat += meal.fat || 0
    return acc
  }, { protein: 0, carbs: 0, fat: 0 })

  // Pie chart data for macros
  const macroData = [
    { name: 'Protein', value: macros.protein, color: '#3B82F6' },
    { name: 'Carbs', value: macros.carbs, color: '#10B981' },
    { name: 'Fat', value: macros.fat, color: '#F59E0B' }
  ]

  const handleMealSubmit = async () => {
    if (mealForm.name && mealForm.calories) {
      await logMeal({
        name: mealForm.name,
        calories: parseInt(mealForm.calories) || 0,
        protein: parseInt(mealForm.protein) || 0,
        carbs: parseInt(mealForm.carbs) || 0,
        fat: parseInt(mealForm.fat) || 0
      })
      setMealForm({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: ""
      })
      setShowMealModal(false)
    }
  }

  // Food Scanning Functions
  const handleFoodScan = () => {
    setShowFoodScanModal(false)
    setShowScanOptions(true)
  }

  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
      scanFoodImage(file)
    }
  }

  const handleCameraCapture = () => {
    // Trigger camera input for mobile back camera
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const handleImportImage = () => {
    // Trigger file input for image import
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const scanFoodImage = async (imageFile) => {
    setIsScanning(true)
    setShowScanOptions(false)

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      }

      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('deep_search', 'true') // Enable deep search for better accuracy

      // Use environment variable or detect local/production backend
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const defaultUrl = isDevelopment 
        ? 'http://localhost:8000' 
        : 'https://food-45609451577.asia-south1.run.app'
      
      const apiBaseUrl = import.meta.env.VITE_FOOD_API_BASE_URL || defaultUrl
      const fullUrl = `${apiBaseUrl}/api/v1/food/analyze`
      
      console.log('🍔 Attempting to analyze food at:', fullUrl)
      console.log('📦 FormData contents:', {
        file: imageFile.name,
        type: imageFile.type,
        size: imageFile.size,
        deep_search: 'true'
      })

      const response = await fetch(fullUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors', // Explicitly enable CORS
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)

      if (!response.ok) {
        let errorMessage = 'An error occurred while analyzing the image'
        try {
          const error = await response.json()
          console.error('❌ Error response:', error)
          errorMessage = error.detail || error.message || response.statusText
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Food analysis result:', data)

      // Extract the first item from items array (main detected food)
      const primaryItem = data.items && data.items.length > 0 ? data.items[0] : null
      
      if (!primaryItem) {
        throw new Error('No food items detected in the image')
      }

      // Parse nutrition values (remove units and convert to numbers)
      const parseNutrition = (value) => {
        if (!value) return 0
        const numValue = parseFloat(value.toString().replace(/[^0-9.]/g, ''))
        return isNaN(numValue) ? 0 : Math.round(numValue)
      }

      // Extract required data from the new API response structure
      const foodData = {
        name: primaryItem.name || 'Unknown Food',
        calories: parseNutrition(primaryItem.nutrition?.calories),
        protein: parseNutrition(primaryItem.nutrition?.protein),
        carbohydrates: parseNutrition(primaryItem.nutrition?.carbs),
        fat: parseNutrition(primaryItem.nutrition?.fats),
        confidence: primaryItem.confidence || 0,
        description: primaryItem.description || '',
        healthScore: data.health_score || 0,
        totalCalories: parseNutrition(data.total_calories_estimate),
        dietaryWarnings: data.dietary_warnings || [],
        overallDescription: data.overall_description || '',
        allItems: data.items || []
      }

      setScanResults(foodData)
      setShowScanResults(true)
    } catch (error) {
      console.error('❌ Food scanning error:', error)
      
      // Provide more helpful error messages
      let userMessage = error.message
      if (error.message.includes('Failed to fetch')) {
        userMessage = `Cannot connect to food analysis service. Please check:\n\n` +
          `1. Your internet connection\n` +
          `2. Backend service is running at: ${import.meta.env.VITE_FOOD_API_BASE_URL || 'https://food-45609451577.asia-south1.run.app'}\n` +
          `3. CORS is enabled on the backend\n\n` +
          `Technical error: ${error.message}`
      } else if (error.message.includes('NetworkError')) {
        userMessage = 'Network error. Please check your internet connection and try again.'
      }
      
      alert(`Failed to analyze food:\n\n${userMessage}`)
      resetScanStates()
    } finally {
      setIsScanning(false)
    }
  }

  const handleAddScannedMeal = async () => {
    if (scanResults) {
      await logMeal({
        name: scanResults.name,
        calories: scanResults.calories,
        protein: scanResults.protein,
        carbs: scanResults.carbohydrates,
        fat: scanResults.fat
      })
      resetScanStates()
    }
  }

  const resetScanStates = () => {
    setShowScanOptions(false)
    setShowScanResults(false)
    setIsScanning(false)
    setScanResults(null)
    setSelectedImage(null)
  }

  const mockFoodScan = async () => {
    const mockFoods = [
      { name: "Apple", calories: 95, protein: 0, carbs: 25, fat: 0 },
      { name: "Chicken Breast (100g)", calories: 231, protein: 31, carbs: 0, fat: 5 },
      { name: "Banana", calories: 89, protein: 1, carbs: 23, fat: 0 },
      { name: "Greek Yogurt", calories: 130, protein: 15, carbs: 9, fat: 0 },
      { name: "Avocado", calories: 234, protein: 3, carbs: 12, fat: 21 },
    ]
    const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)]

    await logMeal(randomFood)
    setShowFoodScanModal(false)
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getMealIcon = (index) => {
    const icons = ['🍳', '🥗', '🍽️', '🍎', '🥤']
    return icons[index % icons.length]
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Diet Tracker</h1>
        <p className="text-ar-gray-400 text-lg">
          Fuel your body with the right nutrition
        </p>
      </motion.div>

      {/* Progress Section */}
      <div className="grid grid-cols-2 gap-3 md:gap-8">
        {/* Calorie Progress */}
        <motion.div
          className="glass-card p-4 md:p-6 rounded-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-center">Calorie Intake</h2>

          <div className="text-center mb-4 md:mb-6">
            <div className="text-3xl md:text-4xl font-bold text-ar-white mb-2">
              {dietCalories}
            </div>
            <div className="text-ar-gray-400 text-sm md:text-base mb-2">
              of {dailyCalorieGoal} calories
            </div>
            <div className="text-ar-orange font-bold text-base md:text-xl">
              {Math.round(progressPercentage)}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-ar-gray-800 rounded-full h-2 md:h-4 mb-4 md:mb-6">
            <motion.div
              className="bg-ar-orange h-2 md:h-4 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Target size={14} className="text-ar-blue md:w-5 md:h-5" />
                <span className="font-bold text-xs md:text-base">Remaining</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-ar-blue">
                {Math.max(dailyCalorieGoal - dietCalories, 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Utensils size={14} className="text-ar-green md:w-5 md:h-5" />
                <span className="font-bold text-xs md:text-base">Meals</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-ar-green">
                {meals.length}/3
              </div>
            </div>
          </div>

          {/* Goal Status - removed from here */}
        </motion.div>

        {/* Macros Pie Chart */}
        <motion.div
          className="glass-card p-3 md:p-6 rounded-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-6 text-center">Macronutrients</h2>

          {macroData.some(macro => macro.value > 0) ? (
            <>
              <div className="h-40 md:h-56 mb-2 md:mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData.filter(macro => macro.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                      className="md:inner-radius-40 md:outer-radius-90"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E1E1E',
                        border: '1px solid #3B82F6',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                      formatter={(value, name) => [`${value}g`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1 md:space-y-2">
                {macroData.map(macro => (
                  <div key={macro.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div
                        className="w-2 h-2 md:w-3 md:h-3 rounded-full"
                        style={{ backgroundColor: macro.color }}
                      />
                      <span className="text-ar-gray-400 text-xs md:text-base">{macro.name}</span>
                    </div>
                    <span className="font-bold text-xs md:text-base" style={{ color: macro.color }}>
                      {macro.value}g
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4 md:py-8 text-ar-gray-400">
              <TrendingUp size={24} className="mx-auto mb-2 md:mb-4 opacity-50 md:w-12 md:h-12" />
              <p className="text-xs md:text-base">No macro data yet</p>
              <p className="text-xs md:text-sm">Start logging meals!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Goal Status - Full Width */}
      {dietGoalMet && (
        <motion.div
          className="bg-ar-green/20 border border-ar-green/50 rounded-xl p-3 md:p-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="text-ar-green font-bold text-sm md:text-base">
              🎯 Daily meal goal achieved!
            </div>
            <div className="text-ar-gray-400 text-xs md:text-sm">
              {meals.length} meals logged
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <button
          onClick={() => setShowMealModal(true)}
          className="glass-card p-4 md:p-6 rounded-2xl hover:border-ar-green/50 transition-all duration-300 hover:shadow-card-hover group"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-3 bg-ar-green/20 rounded-xl group-hover:bg-ar-green/30 transition-colors">
              <Plus className="text-ar-green" size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-bold">Manual Entry</h3>
              <p className="text-ar-gray-400 text-sm md:text-base">Log your meal details</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleFoodScan}
          className="glass-card p-4 md:p-6 rounded-2xl hover:border-ar-blue/50 transition-all duration-300 hover:shadow-card-hover group"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-3 bg-ar-blue/20 rounded-xl group-hover:bg-ar-blue/30 transition-colors">
              <Camera className="text-ar-blue" size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-bold">Food Scan</h3>
              <p className="text-ar-gray-400 text-sm md:text-base">Quick nutrition lookup</p>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Meal Log */}
      <motion.div
        className="glass-card p-4 md:p-6 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Today's Meals</h2>

        {meals.length === 0 ? (
          <div className="text-center py-8 text-ar-gray-400">
            <Utensils size={48} className="mx-auto mb-4 opacity-50" />
            <p>No meals logged today</p>
            <p className="text-sm">Start tracking your nutrition above!</p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {meals.slice().reverse().map((meal, index) => (
              <motion.div
                key={meal.id}
                className="p-4 bg-ar-dark-gray/30 rounded-xl border border-ar-violet/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {getMealIcon(index)}
                    </div>
                    <div>
                      <h3 className="font-bold text-ar-white text-lg">
                        {meal.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-ar-gray mt-1">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatTime(meal.time)}
                        </div>
                        <div className="text-ar-violet font-bold">
                          {meal.calories} cal
                        </div>
                      </div>
                      {(meal.protein > 0 || meal.carbs > 0 || meal.fat > 0) && (
                        <div className="flex gap-4 mt-2 text-xs">
                          {meal.protein > 0 && (
                            <span className="text-ar-blue">
                              {meal.protein}g protein
                            </span>
                          )}
                          {meal.carbs > 0 && (
                            <span className="text-ar-violet">
                              {meal.carbs}g carbs
                            </span>
                          )}
                          {meal.fat > 0 && (
                            <span className="text-red-400">
                              {meal.fat}g fat
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Manual Entry Modal */}
      {showMealModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card p-6 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-6">Add Meal</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Meal name"
                value={mealForm.name}
                onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                className="w-full bg-ar-gray-800 border border-ar-blue/30 rounded-xl px-4 py-3 text-ar-white placeholder-ar-gray-400 focus:outline-none focus:border-ar-blue focus:shadow-card"
              />
              <input
                type="number"
                placeholder="Calories"
                value={mealForm.calories}
                onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
                className="w-full bg-ar-gray-800 border border-ar-blue/30 rounded-xl px-4 py-3 text-ar-white placeholder-ar-gray-400 focus:outline-none focus:border-ar-blue focus:shadow-card"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={mealForm.protein}
                  onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
                  className="bg-ar-gray-800 border border-ar-blue/30 rounded-xl px-3 py-2 text-ar-white placeholder-ar-gray-400 focus:outline-none focus:border-ar-blue text-sm focus:shadow-card"
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={mealForm.carbs}
                  onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
                  className="bg-ar-gray-800 border border-ar-green/30 rounded-xl px-3 py-2 text-ar-white placeholder-ar-gray-400 focus:outline-none focus:border-ar-green text-sm focus:shadow-card"
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                  value={mealForm.fat}
                  onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })}
                  className="bg-ar-gray-800 border border-ar-orange/30 rounded-xl px-3 py-2 text-ar-white placeholder-ar-gray-400 focus:outline-none focus:border-ar-orange text-sm focus:shadow-card"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowMealModal(false)}
                className="flex-1 bg-ar-gray-700 hover:bg-ar-gray-600 text-ar-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleMealSubmit}
                disabled={!mealForm.name || !mealForm.calories}
                className="flex-1 bg-ar-blue hover:bg-ar-blue-light disabled:bg-ar-gray-700 disabled:text-ar-gray-400 text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
              >
                Add Meal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{ display: 'none' }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageSelect}
        style={{ display: 'none' }}
      />

      {/* Food Scan Options Modal */}
      {showScanOptions && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
            <h2 className="text-2xl font-bold mb-6 text-center">Food Scanner</h2>

            <div className="text-center py-4">
              <Camera size={64} className="mx-auto mb-4 text-ar-blue" />
              <p className="text-ar-gray mb-6">
                Choose how you want to scan your food
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleCameraCapture}
                  className="w-full bg-ar-blue hover:bg-ar-blue-light text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Camera size={20} />
                  Take Photo
                </button>

                <button
                  onClick={handleImportImage}
                  className="w-full bg-ar-green hover:bg-ar-green/80 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Upload size={20} />
                  Import Image
                </button>
              </div>

              <button
                onClick={resetScanStates}
                className="w-full mt-4 bg-ar-gray-700 hover:bg-ar-gray-600 text-ar-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Scanning Progress Modal */}
      {isScanning && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="glass-card p-6 rounded-2xl max-w-md w-full text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-ar-blue mx-auto mb-4"></div>
              <h2 className="text-xl font-bold mb-2">Analyzing Food...</h2>
              <p className="text-ar-gray">Please wait while we identify your food</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Scan Results Modal */}
      {showScanResults && scanResults && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card p-6 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Scan Results</h2>
              <button
                onClick={resetScanStates}
                className="p-2 hover:bg-ar-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Food Name with Confidence */}
              <div className="text-center p-4 bg-ar-dark-gray/30 rounded-xl">
                <h3 className="text-xl font-bold text-ar-white mb-2">
                  {scanResults.name}
                </h3>
                {scanResults.confidence && (
                  <div className="text-xs text-ar-gray mb-2">
                    Confidence: {Math.round(scanResults.confidence * 100)}%
                  </div>
                )}
                <div className="text-3xl font-bold text-ar-orange">
                  {scanResults.calories} cal
                </div>
              </div>

              {/* Overall Description */}
              {scanResults.overallDescription && (
                <div className="p-3 bg-ar-dark-gray/20 rounded-xl">
                  <p className="text-sm text-ar-gray-300">
                    {scanResults.overallDescription}
                  </p>
                </div>
              )}

              {/* Health Score */}
              {scanResults.healthScore > 0 && (
                <div className="flex items-center justify-between p-3 bg-ar-dark-gray/20 rounded-xl">
                  <span className="text-sm text-ar-gray">Health Score</span>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold text-ar-green">
                      {scanResults.healthScore}/10
                    </div>
                  </div>
                </div>
              )}

              {/* Dietary Warnings */}
              {scanResults.dietaryWarnings && scanResults.dietaryWarnings.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="text-sm font-semibold text-red-400 mb-2">⚠️ Dietary Warnings:</div>
                  <div className="flex flex-wrap gap-2">
                    {scanResults.dietaryWarnings.map((warning, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full">
                        {warning}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutritional Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-ar-blue/20 rounded-xl border border-ar-blue/30">
                  <div className="text-lg font-bold text-ar-blue">
                    {scanResults.protein}g
                  </div>
                  <div className="text-sm text-ar-gray">Protein</div>
                </div>

                <div className="text-center p-3 bg-ar-green/20 rounded-xl border border-ar-green/30">
                  <div className="text-lg font-bold text-ar-green">
                    {scanResults.carbohydrates}g
                  </div>
                  <div className="text-sm text-ar-gray">Carbs</div>
                </div>

                <div className="text-center p-3 bg-ar-orange/20 rounded-xl border border-ar-orange/30">
                  <div className="text-lg font-bold text-ar-orange">
                    {scanResults.fat}g
                  </div>
                  <div className="text-sm text-ar-gray">Fat</div>
                </div>
              </div>

              {/* Description/Visual Reasoning */}
              {scanResults.description && (
                <div className="p-3 bg-ar-dark-gray/20 rounded-xl">
                  <div className="text-xs font-semibold text-ar-gray mb-1">Analysis:</div>
                  <p className="text-xs text-ar-gray-300">
                    {scanResults.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={resetScanStates}
                className="flex-1 bg-ar-gray-700 hover:bg-ar-gray-600 text-ar-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddScannedMeal}
                className="flex-1 bg-ar-green hover:bg-ar-green/80 text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Add Meal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Food Scan Modal - Legacy (keep for backward compatibility) */}
      {showFoodScanModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
            <h2 className="text-2xl font-bold mb-6 text-center">Food Scanner</h2>

            <div className="text-center py-8">
              <Camera size={64} className="mx-auto mb-4 text-ar-blue" />
              <p className="text-ar-gray mb-6">
                This is a demo version. Click below to scan a random food item!
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowFoodScanModal(false)}
                  className="flex-1 bg-ar-gray-700 hover:bg-ar-gray-600 text-ar-white font-bold py-3 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={mockFoodScan}
                  className="flex-1 bg-ar-blue hover:bg-ar-blue-light text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-button hover:shadow-button-hover"
                >
                  Scan Food
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
