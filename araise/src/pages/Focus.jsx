import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { useUserStore } from "../store/userStore"
import { useNavigate } from "react-router-dom"

// Import focus components directly
import TaskCreation from "../components/focus/TaskCreation.jsx"
import LiveSession from "../components/focus/LiveSession.jsx"
import CompletionFlow from "../components/focus/CompletionFlow.jsx"
import FocusGoalCard from "../components/focus/FocusGoalCard.jsx"
import AddTaskModal from "../components/focus/AddTaskModal.jsx"
import TimeBlockedList from "../components/focus/TimeBlockedList.jsx"
import MinimalStatsRow from "../components/focus/MinimalStatsRow.jsx"
import FocusSessionsCard from "../components/focus/FocusSessionsCard.jsx"
import notificationService from "../services/NotificationService"

import { useXpStore } from "../store/xpStore"

export default function Focus() {
  const [activeView, setActiveView] = useState('dashboard') // 'dashboard', 'create', 'session', 'complete'
  const [currentSession, setCurrentSession] = useState(null)
  const [dashboardRefresh, setDashboardRefresh] = useState(0) // Trigger dashboard refresh
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [completionMeta, setCompletionMeta] = useState({ xpGained: 0, leveledUp: false })
  const [stickyTimer, setStickyTimer] = useState({ 
    visible: false, 
    remaining: 0, 
    isPaused: false, 
    mode: 'Pomodoro', 
    taskName: '',
    cycles: 1,
    currentCycle: 1,
    breakDuration: 5,
    completedBreaks: 0
  })
  const [nextSuggestion, setNextSuggestion] = useState(null)
  const [tasksKey, setTasksKey] = useState(0) // Force re-render when tasks change
  const [forceRefresh, setForceRefresh] = useState(0) // Additional force refresh trigger
  
  const navigate = useNavigate()
  const { 
    logFocusSession, 
    updateFocusProgress, 
    focusLogs = [], 
    saveFocusTask, 
    updateFocusTaskProgress, 
    addFocusTaskReflection,
    dailyFocusGoal = 60,
    setFocusSubSection,
    loadFocusTasks
  } = useUserStore()
  
  // Use a separate selector for focusTasks to ensure reactivity
  const focusTasks = useUserStore((state) => state.focusTasks || [])

  const { xp, level, streakDays, awardXp, touchStreak, checkAndResetDaily, getDailyProgress } = useXpStore()

  // TEST FUNCTION - Remove after debugging
  const testFocusSessionSave = async () => {
    console.log('🧪 Testing focus session save...');
    try {
      await logFocusSession(25, 'Test Pomodoro Session', true);
      console.log('🧪 Test focus session saved successfully');
    } catch (error) {
      console.error('🧪 Test focus session failed:', error);
    }
  };

  // Load focus tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        console.log('[Focus] Loading focus tasks...')
        await loadFocusTasks()
        console.log('[Focus] Focus tasks loaded')
      } catch (error) {
        console.error('[Focus] Error loading focus tasks:', error)
      }
    }
    loadTasks()
  }, [loadFocusTasks])

  // Force re-render when focusTasks changes
  useEffect(() => {
    console.log('[Focus] focusTasks changed, count:', focusTasks.length)
    console.log('[Focus] focusTasks array:', focusTasks)
    setTasksKey(prev => prev + 1)
  }, [focusTasks])

  // Check and reset daily XP on component mount and every minute
  useEffect(() => {
    // Initial check when component mounts
    checkAndResetDaily()
    
    // Check every minute for day changes
    const interval = setInterval(() => {
      checkAndResetDaily()
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [checkAndResetDaily])

  // Track focus sub-section state for navigation hiding
  useEffect(() => {
    if (activeView === 'dashboard') {
      setFocusSubSection(null)
    } else {
      setFocusSubSection(activeView)
    }
  }, [activeView, setFocusSubSection])

  // Function to trigger dashboard refresh
  const refreshDashboard = () => {
    setDashboardRefresh(prev => prev + 1)
  }

  // Real-time progress update handler (throttled to avoid too many Firebase calls)
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0)

  // Handler functions for the new design
  const handleStartSession = (type, task = null) => {
    let sessionData
    
    if (type === 'pomodoro') {
      sessionData = {
        name: task?.name || 'Pomodoro Session',
        duration: 25, // minutes
        breakType: 'pomodoro',
        taskId: task?.id || null
      }
    } else if (type === 'custom' && task) {
      sessionData = {
        name: task.title,
        duration: task.focusDuration || 25,
        breakDuration: task.breakDuration || 5,
        cycles: task.cycles || 1,
        breakType: 'pomodoro',
        taskId: task.id
      }
    }
    
    // Reset progress tracking for new session
    setLastProgressUpdate(0)
    setCurrentSession(sessionData)
    setActiveView('session')
    // Show sticky bar while in session
    const sessionMode = type === 'custom' ? `Custom (${sessionData.duration}min)` : 'Pomodoro'
    setStickyTimer({ 
      visible: true, 
      remaining: sessionData.duration * 60, 
      isPaused: false, 
      mode: sessionMode, 
      taskName: sessionData.name,
      cycles: sessionData.cycles || 1,
      breakDuration: sessionData.breakDuration || 5
    })
  }

  // Suggest starting the next scheduled task when its start time is near
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const today = new Date().toISOString().slice(0, 10)
      const upcoming = (focusTasks || [])
        .filter(t => t.date === today && t.startTime && t.endTime)
        .filter(t => {
          const startAt = new Date(`${t.date}T${t.startTime}:00`).getTime()
          return startAt >= now && (startAt - now) <= 5 * 60 * 1000
        })
        .sort((a,b) => a.startAt - b.startAt)[0]
      if (upcoming && !stickyTimer.visible) {
        setNextSuggestion(upcoming)
        // Fire browser notification if permitted
        if (notificationService.isSupported()) {
          notificationService.requestPermission().then(() => {
            notificationService.showNotification('Upcoming Focus Task', {
              body: `${upcoming.title} starts at ${new Date(upcoming.startAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`,
              tag: 'focus-upcoming',
            })
          })
        }
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [focusTasks, stickyTimer.visible])

  // Track cycle progress during focus sessions
  useEffect(() => {
    if (!stickyTimer.visible || !currentSession) return

    const interval = setInterval(() => {
      if (stickyTimer.isPaused) return

      const totalSessionTime = (currentSession.duration + currentSession.breakDuration) * 60 // in seconds
      const elapsed = (currentSession.duration * 60) - stickyTimer.remaining
      const currentCycle = Math.floor(elapsed / totalSessionTime) + 1
      const completedBreaks = Math.max(0, currentCycle - 1)

      setStickyTimer(prev => ({
        ...prev,
        currentCycle: Math.min(currentCycle, currentSession.cycles || 1),
        completedBreaks: Math.min(completedBreaks, (currentSession.cycles || 1) - 1)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [stickyTimer.visible, stickyTimer.isPaused, currentSession, stickyTimer.remaining])

  const handleCreateCustom = () => {
    setActiveView('create')
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (typeof saveFocusTask === 'function') {
        const newTask = await saveFocusTask({
          name: taskData.name,
          planned: taskData.duration,
          breakType: taskData.breakType,
          customCycles: taskData.customCycles,
          repeat: taskData.repeat
        })
        
        // Set session data for immediate start
        setLastProgressUpdate(0) // Reset progress tracking
        setCurrentSession({
          ...taskData,
          taskId: newTask.id // Add task ID for progress tracking
        })
        setActiveView('session')
      } else {
        // Fallback to just starting the session
        setCurrentSession(taskData)
        setActiveView('session')
      }
    } catch (error) {
      console.error('Error saving custom task:', error)
      // Fallback to just starting the session
      setCurrentSession(taskData)
      setActiveView('session')
    }
  }

              const handleSessionComplete = async (sessionResult) => {
    console.log('[Focus] 🎯 handleSessionComplete called with:', sessionResult);
    console.log('[Focus] currentSession:', currentSession);
    console.log('[Focus] sessionResult type:', typeof sessionResult);
    console.log('[Focus] sessionResult keys:', Object.keys(sessionResult || {}));
    
    // ALWAYS log focus sessions to activities.focus (for progress tracking)
    if (typeof logFocusSession === 'function' && sessionResult?.duration > 0) {
      console.log('[Focus] 📝 Logging focus session to activities.focus');
      console.log('[Focus] Calling logFocusSession with:', {
        duration: sessionResult.duration,
        task: sessionResult.task,
        completed: sessionResult.completed
      });
      await logFocusSession(sessionResult.duration, sessionResult.task, sessionResult.completed);
    } else {
      console.log('[Focus] ❌ NOT logging focus session because:', {
        logFocusSessionExists: typeof logFocusSession === 'function',
        duration: sessionResult?.duration,
        durationValid: sessionResult?.duration > 0
      });
    }
    
    // ALSO update custom task progress if this was linked to a task
    if (currentSession?.taskId && sessionResult?.duration > 0 && typeof updateFocusTaskProgress === 'function') {
      try {
        console.log('[Focus] 📋 Updating task progress for taskId:', currentSession.taskId);
        await updateFocusTaskProgress(currentSession.taskId, sessionResult.duration);
      } catch (error) {
        console.error('Error updating task progress:', error);
      }
    }

    // Update focus progress (include both completed and partial sessions)
    if (typeof updateFocusProgress === 'function' && sessionResult.duration > 0) {
      await updateFocusProgress()
    }
    
    // Only show completion flow if session was actually completed
    if (sessionResult.completed) {
      // Award XP: 1 XP per focused minute (streak logic handled automatically)
      if (sessionResult.duration > 0) {
        const prevLevel = useXpStore.getState().level
        awardXp(sessionResult.duration, dailyFocusGoal)
        const nextLevel = useXpStore.getState().level
        setCompletionMeta({ xpGained: sessionResult.duration, leveledUp: nextLevel > prevLevel })
      }
      setActiveView('complete')
    } else {
      // For partial sessions, return to dashboard
      handleReturnToDashboard()
    }
  }

  const handleSessionEnd = () => {
    setCurrentSession(null)
    refreshDashboard() // Refresh dashboard data
    setActiveView('dashboard')
    setStickyTimer(prev => ({ ...prev, visible: false }))
  }



  const handleReturnToDashboard = () => {
    setCurrentSession(null)
    refreshDashboard() // Refresh dashboard data
    setActiveView('dashboard')
  }

  const handleAddReflection = async (reflection) => {
    // Save reflection as completion description to the task
    if (currentSession?.taskId && reflection.trim() && typeof addFocusTaskReflection === 'function') {
      try {
        await addFocusTaskReflection(currentSession.taskId, reflection)
      } catch (error) {
        console.error('Error saving completion description:', error)
      }
    }
  }

  const handleProgressUpdate = async (taskId, minutesSpent) => {
    try {
      // Only update every minute to avoid too many Firebase calls
      if (minutesSpent > lastProgressUpdate) {
        const progressToAdd = minutesSpent - lastProgressUpdate
        
        if (progressToAdd > 0) {
          await updateFocusTaskProgress(taskId, progressToAdd)
          
          // Also update overall focus progress
          if (typeof updateFocusProgress === 'function') {
            await updateFocusProgress()
          }
          
          setLastProgressUpdate(minutesSpent)
        }
      }
    } catch (error) {
      console.error('Error updating real-time progress:', error)
    }
  }

  // Handle focus session card events
  const handleFocusSessionStart = (sessionData) => {
    // Set up session data for LiveSession component
    const sessionConfig = {
      name: sessionData.name,
      duration: sessionData.duration,
      breakDuration: sessionData.breakDuration || 0,
      cycles: sessionData.cycles || 1,
      breakType: 'pomodoro',
      taskId: null // No specific task for these sessions
    }
    
    // Reset progress tracking for new session
    setLastProgressUpdate(0)
    setCurrentSession(sessionConfig)
    setActiveView('session')
  }

  // This method is not used - sessions go through LiveSession → handleSessionComplete
  const handleFocusSessionEnd = async (sessionResult) => {
    console.log('[Focus] ⚠️ handleFocusSessionEnd called - this should not happen');
    console.log('[Focus] Sessions should go through LiveSession → handleSessionComplete');
    
    // Fallback: redirect to handleSessionComplete
    await handleSessionComplete(sessionResult);
  }

  // Calculate total focused time today (including completed tasks)
  const getTotalFocusedToday = () => {
    const today = new Date().toISOString().slice(0, 10)
    
    console.log('[Focus] Calculating total focused time for today:', today)
    console.log('[Focus] focusLogs:', focusLogs)
    console.log('[Focus] focusTasks:', focusTasks)
    
    // Get focus log sessions (pomodoro sessions)
    const todaysSessions = focusLogs.filter(log => 
      log.time && log.time.slice(0, 10) === today && log.completed
    )
    const focusLogMinutes = todaysSessions.reduce((total, session) => total + (session.duration || 0), 0)
    console.log('[Focus] Focus log minutes:', focusLogMinutes)
    
    // Get today's tasks and sum their completed minutes
    const todaysTasks = focusTasks.filter(task => task.date === today)
    const taskMinutes = todaysTasks.reduce((total, task) => {
      // Use the 'completed' field which tracks actual minutes completed
      return total + (task.completed || 0)
    }, 0)
    console.log('[Focus] Task minutes:', taskMinutes)
    
    const totalMinutes = focusLogMinutes + taskMinutes
    console.log('[Focus] Total focused minutes:', totalMinutes)
    
    return totalMinutes
  }

  const getPlannedFocusGoal = () => {
    // Get the daily focus goal from userStore
    return dailyFocusGoal // This is the daily focus goal in minutes
  }

  const calculateScheduledForToday = (allTasks) => {
    // Calculate time from scheduled tasks (for reference)
    const today = new Date().toISOString().slice(0, 10)
    return (allTasks || [])
      .filter(t => t.date === today && t.startTime && t.endTime)
      .reduce((m, t) => {
        const startAt = new Date(`${t.date}T${t.startTime}:00`).getTime()
        const endAt = new Date(`${t.date}T${t.endTime}:00`).getTime()
        return m + Math.max(0, Math.round((endAt - startAt) / 60000))
      }, 0)
  }

  return (
    <AnimatePresence mode="wait">
      {activeView === 'dashboard' && (
        <div className="px-3 py-4 space-y-3 md:space-y-6 md:px-4 md:py-6 max-w-5xl mx-auto">
          {nextSuggestion && (
            <div className="glass-card p-3 rounded-lg border border-ar-gray-700/60 flex items-center justify-between">
              <div className="text-sm text-ar-white">
                Upcoming: <span className="font-medium">{nextSuggestion.title}</span> starts at {new Date(nextSuggestion.startAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { handleStartSession('pomodoro', { name: nextSuggestion.title }); setNextSuggestion(null) }} className="px-3 py-2 rounded bg-ar-blue text-white text-sm">Start Now</button>
                <button onClick={() => setNextSuggestion(null)} className="px-3 py-2 rounded bg-ar-gray-700 text-ar-gray-200 text-sm">Dismiss</button>
              </div>
            </div>
          )}
          <FocusGoalCard
            quote="Win the next block of time."
            plannedMinutes={getPlannedFocusGoal()}
            completedMinutes={getTotalFocusedToday()}
            xp={(() => {
              try {
                return getDailyProgress(dailyFocusGoal).dailyXp || 0
              } catch (error) {
                console.warn('Error getting daily progress:', error)
                return 0
              }
            })()}
            nextLevelXp={dailyFocusGoal}
            streakDays={streakDays}
          />

          <MinimalStatsRow focusLogs={focusLogs} streakDays={streakDays} tasks={focusTasks} />

          <FocusSessionsCard 
            onStartSession={handleFocusSessionStart}
            onEndSession={handleFocusSessionEnd}
          />

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => navigate('/focus/calendar')} className="flex-1 bg-ar-gray-800/60 border border-ar-gray-700 rounded-lg p-2 md:p-3 text-ar-white text-sm md:text-base font-medium touch-manipulation">📆 View Schedule➤</button>
            <button onClick={() => setIsAddOpen(true)} className="flex-1 bg-ar-blue text-white rounded-lg p-2 md:p-3 text-sm md:text-base font-medium touch-manipulation">➕ Add New Task</button>
          </div>

          <TimeBlockedList 
            key={`${tasksKey}-${forceRefresh}-${focusTasks.length}`} 
            onStart={(task) => handleStartSession('custom', task)} 
          />

          {/* Modals */}
          <AddTaskModal 
            isOpen={isAddOpen} 
            onClose={async () => {
              setIsAddOpen(false)
              // Force reload tasks after modal closes with multiple triggers
              console.log('[Focus] Modal closed, reloading tasks...')
              await loadFocusTasks()
              // Force re-render by updating both keys
              setTasksKey(prev => prev + 1)
              setForceRefresh(prev => prev + 1)
              console.log('[Focus] Tasks reloaded after modal close')
            }} 
            loadFocusTasks={async () => {
              await loadFocusTasks()
              setTasksKey(prev => prev + 1)
              setForceRefresh(prev => prev + 1)
            }} 
          />
          {/* Calendar modal removed in favor of inline calendar (keeping import for now if used elsewhere) */}
        </div>
      )}
      
      {activeView === 'create' && (
        <TaskCreation
          onSave={handleSaveTask}
          onClose={() => {
            refreshDashboard() // Refresh dashboard when closing task creation
            setActiveView('dashboard')
          }}
        />
      )}
      
      {activeView === 'session' && currentSession && (
        <LiveSession
          sessionData={currentSession}
          onComplete={handleSessionComplete}
          onEnd={handleSessionEnd}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
      
      {activeView === 'complete' && currentSession && (
        <CompletionFlow
          sessionData={currentSession}
          xpGained={completionMeta.xpGained}
          leveledUp={completionMeta.leveledUp}
          onReturnToDashboard={handleReturnToDashboard}
          onAddReflection={handleAddReflection}
          totalFocusedToday={getTotalFocusedToday()}
        />
      )}
      

    </AnimatePresence>
  )
}
