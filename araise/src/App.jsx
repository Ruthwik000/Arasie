import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Navigation from "./components/Navigation"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Workout from "./pages/Workout"
import Water from "./pages/Water"
import Diet from "./pages/Diet"
import MentalHealth from "./pages/MentalHealth"
import Focus from "./pages/Focus"
import FocusCalendar from "./pages/FocusCalendar"
import History from "./pages/History"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Welcome from "./pages/Welcome"
import Feedback from "./pages/Feedback"
import { useUserStore } from "./store/userStore"
import { useXpStore } from "./store/xpStore"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Function to check if current route should hide navigation
function shouldHideNavigation(pathname) {
  const hideNavRoutes = [
    // Workout category selection (gym, calisthenics, etc.)
    /^\/workout\/[^\/]+$/, // /workout/gym
    
    // Workout split detail pages
    /^\/workout\/[^\/]+\/[^\/]+$/, // /workout/gym/push-pull-legs
    
    // Workout day detail pages (for gym/calisthenics)
    /^\/workout\/[^\/]+\/[^\/]+\/[^\/]+$/, // /workout/gym/push-pull-legs/push
    
    // Workout sessions (both day-based and sequence-based)
    /^\/workout\/[^\/]+\/[^\/]+\/session$/, // /workout/stretching/morning-flow/session
    /^\/workout\/[^\/]+\/[^\/]+\/[^\/]+\/session$/, // /workout/gym/push-pull-legs/push/session
    
    // Form analyzer routes
    /^\/workout\/[^\/]+\/[^\/]+\/session\/[^\/]+\/analyzer/, // /workout/stretching/morning-flow/session/1/analyzer/pose-name
    /^\/workout\/[^\/]+\/[^\/]+\/[^\/]+\/session\/[^\/]+\/analyzer/, // /workout/gym/push-pull-legs/push/session/1/analyzer/exercise-name
    
    // Workout completion pages
    /^\/workout\/[^\/]+\/[^\/]+\/complete$/, // /workout/stretching/morning-flow/complete
    /^\/workout\/[^\/]+\/[^\/]+\/[^\/]+\/complete$/, // /workout/gym/push-pull-legs/push/complete
    
    // Custom workout routes
    /^\/workout\/custom\/builder$/, // /workout/custom/builder
    /^\/workout\/custom\/my-workouts$/, // /workout/custom/my-workouts
    /^\/workout\/custom\/[^\/]+\/session$/, // /workout/custom/123/session
    /^\/workout\/custom\/[^\/]+\/complete$/, // /workout/custom/123/complete
    /^\/workout\/custom\/[^\/]+\/session\/[^\/]+\/analyzer/, // /workout/custom/123/session/1/analyzer/exercise-name
    
    // Focus calendar
    /^\/focus\/calendar$/, // /focus/calendar
    
    // Mental Health sessions (if they exist)
    /^\/mental-health\/[^\/]+\/session$/, // /mental-health/breathing/session
  ]
  
  return hideNavRoutes.some(pattern => pattern.test(pathname))
}

function AppContent() {
  const resetDaily = useUserStore(state => state.resetDaily)
  const isAuthenticated = useUserStore(state => state.isAuthenticated)
  const isChatOpen = useUserStore(state => state.isChatOpen)
  const mentalHealthSubSection = useUserStore(state => state.mentalHealthSubSection)
  const focusSubSection = useUserStore(state => state.focusSubSection)
  const setUser = useUserStore(state => state.setUser)
  const logout = useUserStore(state => state.logout)
  const checkAndResetDaily = useXpStore(state => state.checkAndResetDaily)
  const { currentUser, loading } = useAuth()
  const location = useLocation()
  
  // Check if navigation should be hidden (route-based or sub-sections)
  const hideNavigation = shouldHideNavigation(location.pathname) || 
                         mentalHealthSubSection !== null || 
                         focusSubSection !== null
  
  // Debug log for development (can be removed in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Navigation state:', { 
        path: location.pathname, 
        mentalHealthSubSection, 
        focusSubSection, 
        hideNavigation 
      })
    }
  }, [location.pathname, mentalHealthSubSection, focusSubSection, hideNavigation])

  // Sync Firebase auth state with Zustand store
  useEffect(() => {
    const syncUser = async () => {
      if (currentUser) {
        await setUser(currentUser)
      } else {
        logout()
      }
    }

    if (!loading) {
      syncUser()
    }
  }, [currentUser, loading, setUser, logout])

  // Reset daily progress on app start (only when authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      resetDaily()
    }
  }, [resetDaily, isAuthenticated])

  // Reset daily XP on app start and check periodically
  useEffect(() => {
    if (isAuthenticated) {
      // Initial check when app loads
      checkAndResetDaily()

      // Check every hour for day changes
      const interval = setInterval(() => {
        checkAndResetDaily()
      }, 3600000) // Check every hour

      return () => clearInterval(interval)
    }
  }, [checkAndResetDaily, isAuthenticated])

  // Show loading screen while Firebase initializes
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ar-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-white">Initializing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-ar-black">
      {/* Show navigation when authenticated, chat is not open, and navigation should not be hidden */}
      {isAuthenticated && !isChatOpen && !hideNavigation && <Navigation />}

      {/* Main content area with conditional spacing */}
      <main className={`flex-1 ${
        isAuthenticated && !isChatOpen && !hideNavigation 
          ? 'md:ml-64 pb-24 md:pb-0 pt-20 md:pt-0 p-4 md:p-6 lg:p-8' 
          : hideNavigation && isAuthenticated
          ? 'min-h-screen w-full' // Full-screen for sub-sections with proper height
          : ''
      }`}>
        <div className={`${
          isAuthenticated && !isChatOpen && !hideNavigation 
            ? 'max-w-7xl mx-auto' 
            : hideNavigation && isAuthenticated
            ? 'w-full h-full min-h-screen' // Full width and height for sub-sections
            : 'w-full'
        }`}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Welcome />
              } />
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              } />
              <Route path="/signup" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/workout/*" element={
                <ProtectedRoute>
                  <Workout />
                </ProtectedRoute>
              } />
              <Route path="/water" element={
                <ProtectedRoute>
                  <Water />
                </ProtectedRoute>
              } />
              <Route path="/diet" element={
                <ProtectedRoute>
                  <Diet />
                </ProtectedRoute>
              } />
              <Route path="/mental-health" element={
                <ProtectedRoute>
                  <MentalHealth />
                </ProtectedRoute>
              } />
              <Route path="/focus" element={
                <ProtectedRoute>
                  <Focus />
                </ProtectedRoute>
              } />
              <Route path="/focus/calendar" element={
                <ProtectedRoute>
                  <FocusCalendar />
                </ProtectedRoute>
              } />
              <Route path="/history/:date" element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/feedback" element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </main>
      </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
