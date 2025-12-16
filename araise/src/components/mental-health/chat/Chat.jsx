import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, ArrowLeft, Menu, MessageSquare, Trash2, Sparkles, Volume2, VolumeX } from "lucide-react"
import { useUserStore } from "../../../store/userStore"
import { useAuth } from "../../../contexts/AuthContext"
import VoiceModal from "./VoiceModal"

// API Base URL
const API_BASE_URL = "https://mental-health-agent-0oib.onrender.com"

export default function Chat({ onBack }) {
  const { updateMentalHealthProgress, logChatSession } = useUserStore()
  const { currentUser } = useAuth()

  const handleBack = async () => {
    // Stop any ongoing speech - with proper state check
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      try {
        window.speechSynthesis.cancel()
      } catch (error) {
        console.warn('Error cancelling speech:', error)
      }
    }

    // Log chat session when user leaves
    const session = chatSessions.find(s => s.session_id === currentSessionId)
    if (session && session.messages.length > 0) {
      const userMessages = session.messages.filter(m => m.role === 'user')
      const topics = userMessages.map(m => m.content.substring(0, 50)).slice(0, 3)
      const summary = `Chat session with ${userMessages.length} messages`

      await logChatSession(summary, topics)
      await updateMentalHealthProgress(15)
    }

    onBack()
  }

  const [chatSessions, setChatSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(() => {
    // Persist auto-speak preference
    const saved = localStorage.getItem('chat-auto-speak')
    return saved ? JSON.parse(saved) : false
  })
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    // Check if user has seen the welcome message before
    const seen = localStorage.getItem('chat-welcome-seen')
    return seen === 'true'
  })

  const chatEndRef = useRef(null)
  const inputRef = useRef(null)
  const speechSynthRef = useRef(null)

  const currentSession = chatSessions.find(session => session.session_id === currentSessionId)
  const chatMessages = currentSession?.messages || []

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis
      
      // Wait for voices to load
      const loadVoices = () => {
        const voices = speechSynthRef.current.getVoices()
        if (voices.length > 0) {
          setVoicesLoaded(true)
        }
      }
      
      // Load voices immediately if available
      loadVoices()
      
      // Also listen for voiceschanged event
      if (speechSynthRef.current.onvoiceschanged !== undefined) {
        speechSynthRef.current.onvoiceschanged = loadVoices
      }
    }

    return () => {
      // Cleanup: stop any ongoing speech
      if (speechSynthRef.current && speechSynthRef.current.speaking) {
        try {
          speechSynthRef.current.cancel()
        } catch (error) {
          console.warn('Cleanup speech error:', error)
        }
      }
      // Ensure body styles are reset on unmount
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [])

  // Function to speak text
  const speakText = (text) => {
    if (!speechSynthRef.current || !text || !voicesLoaded) return

    try {
      // Cancel any ongoing speech
      if (speechSynthRef.current.speaking) {
        speechSynthRef.current.cancel()
      }

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set voice properties for a warm, friendly female voice
      utterance.rate = 0.95 // Slightly slower for better comprehension
      utterance.pitch = 1.1 // Slightly higher pitch for warmth
      utterance.volume = 1.0
      
      // Try to get a female voice (only after voices are loaded)
      const voices = speechSynthRef.current.getVoices()
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Microsoft Zira')
      )
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthRef.current.speak(utterance)
    } catch (error) {
      console.error('Error in text-to-speech:', error)
      setIsSpeaking(false)
    }
  }

  // Function to stop speaking
  const stopSpeaking = () => {
    if (speechSynthRef.current && speechSynthRef.current.speaking) {
      try {
        speechSynthRef.current.cancel()
      } catch (error) {
        console.warn('Error stopping speech:', error)
      }
      setIsSpeaking(false)
    }
  }
  
  // Persist auto-speak preference
  useEffect(() => {
    localStorage.setItem('chat-auto-speak', JSON.stringify(autoSpeak))
  }, [autoSpeak])

  // Load chat sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      if (!currentUser?.uid) return

      try {
        const response = await fetch(`${API_BASE_URL}/sessions/${currentUser.uid}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch sessions')
        }

        const data = await response.json()
        console.log('Sessions API response:', data)
        
        if (data.success && data.sessions && data.sessions.length > 0) {
          // Transform the sessions to match our structure
          const transformedSessions = data.sessions.map(session => {
            // Each message in the API has both query (user) and response (assistant)
            const messages = []
            session.messages.forEach(msg => {
              // Add user message
              if (msg.query) {
                messages.push({
                  role: 'user',
                  content: msg.query,
                  timestamp: msg.timestamp
                })
              }
              // Add assistant message
              if (msg.response) {
                messages.push({
                  role: 'assistant',
                  content: msg.response,
                  timestamp: msg.timestamp
                })
              }
            })
            
            return {
              session_id: session.session_id,
              title: session.messages[0]?.query?.substring(0, 50) || 'Chat Session',
              created_at: session.created_at,
              messages: messages
            }
          })
          
          setChatSessions(transformedSessions)
          // Don't set current session - always start with a new chat
          setCurrentSessionId(null)
        }
      } catch (error) {
        console.error('Error fetching sessions:', error)
      }
    }

    fetchSessions()
  }, [currentUser])

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSessionId, chatSessions])

  const handleSendMessage = async (messageText = currentMessage) => {
    if (!messageText.trim() || !currentUser?.uid) return

    // Mark welcome as seen when user sends first message
    if (!hasSeenWelcome) {
      setHasSeenWelcome(true)
      localStorage.setItem('chat-welcome-seen', 'true')
    }

    // Normalize timestamp to ISO format
    const timestamp = new Date().toISOString()
    
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: timestamp
    }

    // If it's a new chat, create a session entry first
    if (!currentSessionId) {
      const newSession = {
        session_id: null,
        title: messageText.substring(0, 50),
        created_at: new Date().toISOString(),
        messages: [userMessage]
      }
      setChatSessions(prev => [newSession, ...prev])
    } else {
      // Update existing session with new message
      setChatSessions(prev => prev.map(session =>
        session.session_id === currentSessionId
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      ))
    }

    setCurrentMessage('')
    setIsLoading(true)

    // Focus input after sending
    setTimeout(() => inputRef.current?.focus(), 100)

    try {
      // Prepare URL with query parameters
      const url = new URL(`${API_BASE_URL}/query/${currentUser.uid}`)
      url.searchParams.append('query', messageText)
      
      // Add session_id only if we have an existing session
      if (currentSessionId) {
        url.searchParams.append('session_id', currentSessionId)
      }

      console.log('Sending request to:', url.toString())

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      console.log('API Response:', data)

      if (!data.success) {
        throw new Error('API returned unsuccessful response')
      }

      // Normalize timestamp to ISO format
      const aiTimestamp = data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString()
      
      const aiMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: aiTimestamp
      }

      // Update session with AI response and session_id
      if (!currentSessionId) {
        // For new chats, update the first session
        setChatSessions(prev => prev.map((session, index) => {
          if (index === 0 && session.session_id === null) {
            return {
              ...session,
              session_id: data.session_id,
              messages: [...session.messages, aiMessage],
              created_at: new Date().toISOString() // Update to current time
            }
          }
          return session
        }))
        setCurrentSessionId(data.session_id)
      } else {
        // For existing chats, update the matching session and move to top with new timestamp
        setChatSessions(prev => {
          const updatedSessions = prev.map(session => {
            if (session.session_id === currentSessionId) {
              return {
                ...session,
                messages: [...session.messages, aiMessage],
                created_at: new Date().toISOString() // Update to current time
              }
            }
            return session
          })
          
          // Move the updated session to the top
          const currentSession = updatedSessions.find(s => s.session_id === currentSessionId)
          const otherSessions = updatedSessions.filter(s => s.session_id !== currentSessionId)
          
          return currentSession ? [currentSession, ...otherSessions] : updatedSessions
        })
      }

      // Speak the AI response
      if (showVoiceModal && window.voiceModalSpeakText) {
        // Use voice modal's speech synthesis
        setTimeout(() => window.voiceModalSpeakText(data.response), 500)
      } else if (autoSpeak) {
        // Use regular text-to-speech if auto-speak is enabled
        setTimeout(() => speakText(data.response), 500)
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Check if it's a network error
      const isNetworkError = !navigator.onLine || error.message.includes('fetch')
      const errorContent = isNetworkError
        ? "I'm having trouble connecting right now. Please check your internet connection and try again."
        : "I'm sorry, I'm having trouble responding right now. Please try again in a moment. Remember, if you're experiencing a mental health crisis, please reach out to a healthcare professional or crisis helpline."
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date().toISOString()
      }
      
      if (!currentSessionId) {
        setChatSessions(prev => prev.map((session, index) => {
          if (index === 0) {
            return { ...session, messages: [...session.messages, errorMessage] }
          }
          return session
        }))
      } else {
        setChatSessions(prev => prev.map(session =>
          session.session_id === currentSessionId
            ? { ...session, messages: [...session.messages, errorMessage] }
            : session
        ))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const startNewChat = () => {
    const newSession = {
      session_id: null, // Will be set when first message is sent
      title: `New Chat`,
      created_at: new Date().toISOString(),
      messages: []
    }
    setChatSessions(prev => [newSession, ...prev])
    setCurrentSessionId(null)
    setShowSidebar(false)
  }

  // Group sessions by date
  const groupSessionsByDate = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastMonth = new Date(today)
    lastMonth.setDate(lastMonth.getDate() - 30)

    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: []
    }

    chatSessions.forEach(session => {
      const sessionDate = new Date(session.created_at)
      const isToday = sessionDate.toDateString() === today.toDateString()
      const isYesterday = sessionDate.toDateString() === yesterday.toDateString()
      const isThisWeek = sessionDate > lastWeek && !isToday && !isYesterday
      const isThisMonth = sessionDate > lastMonth && !isThisWeek && !isToday && !isYesterday

      if (isToday) groups.today.push(session)
      else if (isYesterday) groups.yesterday.push(session)
      else if (isThisWeek) groups.thisWeek.push(session)
      else if (isThisMonth) groups.thisMonth.push(session)
      else groups.older.push(session)
    })

    return groups
  }

  const deleteChat = (sessionId) => {
    // Handle null session IDs (unsaved sessions)
    if (sessionId === null) {
      setChatSessions(prev => prev.filter((session, index) => index !== 0 || session.session_id !== null))
    } else {
      setChatSessions(prev => prev.filter(session => session.session_id !== sessionId))
    }
    
    if (sessionId === currentSessionId && chatSessions.length > 1) {
      const remainingSessions = chatSessions.filter(session => session.session_id !== sessionId)
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].session_id)
      } else {
        setCurrentSessionId(null)
      }
    }
  }

  const toggleVoiceMode = () => {
    setShowVoiceModal(!showVoiceModal)
  }

  const handleVoiceModalClose = () => {
    setShowVoiceModal(false)
    // Ensure body styles are reset and refocus input
    setTimeout(() => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      // Refocus input after modal closes
      inputRef.current?.focus()
    }, 100)
  }

  return (
    <div className="flex flex-row-reverse h-screen w-full bg-gradient-to-br from-ar-black via-ar-black to-blue-900/20 fixed inset-0 z-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Sidebar - Moved to Right */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setShowSidebar(false)}
            />

            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-ar-black/80 backdrop-blur-xl border-l border-blue-500/20 flex flex-col z-50 md:relative md:w-80"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-400" />
                    Chat History
                  </h3>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="md:hidden p-1 text-ar-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
                <motion.button
                  onClick={startNewChat}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600/20 to-blue-500/10 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Sparkles size={16} className="group-hover:text-blue-300 transition-colors" />
                  New Chat
                </motion.button>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-2">
                {chatSessions.length === 0 ? (
                  <div className="text-center text-ar-gray-400 text-sm mt-8">
                    No chat history yet
                  </div>
                ) : (
                  (() => {
                    const groups = groupSessionsByDate()
                    let globalIndex = 0
                    
                    return (
                      <>
                        {groups.today.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs font-semibold text-ar-gray-500 uppercase tracking-wider mb-2 px-2">Today</h4>
                            {groups.today.map((session) => {
                              const index = globalIndex++
                              return (
                                <motion.div
                                  key={session.session_id || `new-${index}`}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`group flex items-center justify-between p-3 rounded-xl mb-2 cursor-pointer transition-all duration-300 ${session.session_id === currentSessionId
                                    ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/15 border border-blue-500/40 text-white shadow-lg shadow-blue-500/10'
                                    : 'text-ar-gray-300 hover:bg-blue-500/10 hover:border hover:border-blue-500/20 hover:text-white backdrop-blur-sm'
                                    }`}
                                  onClick={() => {
                                    setCurrentSessionId(session.session_id)
                                    setShowSidebar(false)
                                  }}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {session.title || 'New Chat'}
                                    </p>
                                    <p className="text-xs text-ar-gray-400">
                                      {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                  {chatSessions.length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteChat(session.session_id)
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-ar-gray-400 hover:text-red-400 transition-all duration-300"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </motion.div>
                              )
                            })}
                          </div>
                        )}

                        {groups.yesterday.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs font-semibold text-ar-gray-500 uppercase tracking-wider mb-2 px-2">Yesterday</h4>
                            {groups.yesterday.map((session) => {
                              const index = globalIndex++
                              return (
                                <motion.div
                                  key={session.session_id || `new-${index}`}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`group flex items-center justify-between p-3 rounded-xl mb-2 cursor-pointer transition-all duration-300 ${session.session_id === currentSessionId
                                    ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/15 border border-blue-500/40 text-white shadow-lg shadow-blue-500/10'
                                    : 'text-ar-gray-300 hover:bg-blue-500/10 hover:border hover:border-blue-500/20 hover:text-white backdrop-blur-sm'
                                    }`}
                                  onClick={() => {
                                    setCurrentSessionId(session.session_id)
                                    setShowSidebar(false)
                                  }}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {session.title || 'New Chat'}
                                    </p>
                                    <p className="text-xs text-ar-gray-400">
                                      {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                  {chatSessions.length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteChat(session.session_id)
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-ar-gray-400 hover:text-red-400 transition-all duration-300"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </motion.div>
                              )
                            })}
                          </div>
                        )}

                        {groups.thisWeek.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs font-semibold text-ar-gray-500 uppercase tracking-wider mb-2 px-2">This Week</h4>
                            {groups.thisWeek.map((session) => {
                              const index = globalIndex++
                              return (
                                <motion.div
                                  key={session.session_id || `new-${index}`}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`group flex items-center justify-between p-3 rounded-xl mb-2 cursor-pointer transition-all duration-300 ${session.session_id === currentSessionId
                                    ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/15 border border-blue-500/40 text-white shadow-lg shadow-blue-500/10'
                                    : 'text-ar-gray-300 hover:bg-blue-500/10 hover:border hover:border-blue-500/20 hover:text-white backdrop-blur-sm'
                                    }`}
                                  onClick={() => {
                                    setCurrentSessionId(session.session_id)
                                    setShowSidebar(false)
                                  }}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {session.title || 'New Chat'}
                                    </p>
                                    <p className="text-xs text-ar-gray-400">
                                      {new Date(session.created_at).toLocaleDateString([], { weekday: 'short' })}
                                    </p>
                                  </div>
                                  {chatSessions.length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteChat(session.session_id)
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-ar-gray-400 hover:text-red-400 transition-all duration-300"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </motion.div>
                              )
                            })}
                          </div>
                        )}

                        {groups.thisMonth.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs font-semibold text-ar-gray-500 uppercase tracking-wider mb-2 px-2">This Month</h4>
                            {groups.thisMonth.map((session) => {
                              const index = globalIndex++
                              return (
                                <motion.div
                                  key={session.session_id || `new-${index}`}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`group flex items-center justify-between p-3 rounded-xl mb-2 cursor-pointer transition-all duration-300 ${session.session_id === currentSessionId
                                    ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/15 border border-blue-500/40 text-white shadow-lg shadow-blue-500/10'
                                    : 'text-ar-gray-300 hover:bg-blue-500/10 hover:border hover:border-blue-500/20 hover:text-white backdrop-blur-sm'
                                    }`}
                                  onClick={() => {
                                    setCurrentSessionId(session.session_id)
                                    setShowSidebar(false)
                                  }}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {session.title || 'New Chat'}
                                    </p>
                                    <p className="text-xs text-ar-gray-400">
                                      {new Date(session.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </p>
                                  </div>
                                  {chatSessions.length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteChat(session.session_id)
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-ar-gray-400 hover:text-red-400 transition-all duration-300"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </motion.div>
                              )
                            })}
                          </div>
                        )}

                        {groups.older.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs font-semibold text-ar-gray-500 uppercase tracking-wider mb-2 px-2">Older</h4>
                            {groups.older.map((session) => {
                              const index = globalIndex++
                              return (
                                <motion.div
                                  key={session.session_id || `new-${index}`}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`group flex items-center justify-between p-3 rounded-xl mb-2 cursor-pointer transition-all duration-300 ${session.session_id === currentSessionId
                                    ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/15 border border-blue-500/40 text-white shadow-lg shadow-blue-500/10'
                                    : 'text-ar-gray-300 hover:bg-blue-500/10 hover:border hover:border-blue-500/20 hover:text-white backdrop-blur-sm'
                                    }`}
                                  onClick={() => {
                                    setCurrentSessionId(session.session_id)
                                    setShowSidebar(false)
                                  }}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {session.title || 'New Chat'}
                                    </p>
                                    <p className="text-xs text-ar-gray-400">
                                      {new Date(session.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                  </div>
                                  {chatSessions.length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteChat(session.session_id)
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-ar-gray-400 hover:text-red-400 transition-all duration-300"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </motion.div>
                              )
                            })}
                          </div>
                        )}
                      </>
                    )
                  })()
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-ar-black/40 backdrop-blur-xl border-b border-blue-500/20"
        >
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 glass-card rounded-xl hover:border-ar-blue/50 transition-all duration-300 flex items-center justify-center"
            >
              <ArrowLeft size={20} className="text-ar-blue" />
            </motion.button>

            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-blue-400/20 backdrop-blur-sm border border-blue-400/30 rounded-full flex items-center justify-center relative overflow-hidden">
                  <span className="text-white text-sm font-semibold relative z-10">N</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-300/15"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-blue-300/15 rounded-full blur-sm"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              <div>
                <h1 className="text-lg font-poppins font-semibold text-white">
                  Nivi
                </h1>
                <p className="text-xs text-blue-300">
                  Always here to listen
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Menu button */}
            <motion.button
              onClick={() => setShowSidebar(!showSidebar)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-ar-gray-300 hover:text-white transition-colors rounded-lg hover:bg-blue-500/10"
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto relative">
          {chatMessages.length === 0 && !hasSeenWelcome ? (
            // Welcome Screen - Only shown once for first-time users
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center h-full px-6"
            >
              <p className="text-blue-200/70 text-center text-lg max-w-md">
                Share your thoughts, feelings, or anything on your mind
              </p>
            </motion.div>
          ) : chatMessages.length === 0 ? (
            // Empty state for returning users
            <div className="flex items-center justify-center h-full px-6">
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-400/10 backdrop-blur-sm border border-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-white text-2xl font-semibold">N</span>
                </motion.div>
                <p className="text-gray-400 text-sm">Start a new conversation</p>
              </div>
            </div>
          ) : (
            // Chat Messages
            <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
              {chatMessages.map((message, index) => (
                <motion.div
                  key={`${message.timestamp}-${index}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden ${message.role === 'assistant'
                      ? 'bg-gradient-to-br from-blue-500/30 to-blue-400/20 backdrop-blur-sm border border-blue-400/30'
                      : 'bg-gradient-to-br from-gray-600/50 to-gray-500/50 backdrop-blur-sm border border-gray-400/30'
                      }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-white text-sm font-semibold relative z-10">
                      {message.role === 'assistant' ? 'N' : 'Y'}
                    </span>
                    {message.role === 'assistant' && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-300/8"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Message Content */}
                  <div className="flex-1 max-w-3xl">
                    <motion.div
                      className={`p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-sm border ${message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600/20 to-blue-500/10 border-blue-400/30 text-white ml-auto max-w-md'
                        : 'bg-gradient-to-br from-gray-800/40 to-gray-700/20 border-gray-600/20 text-gray-100 mr-auto'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {message.content}
                    </motion.div>
                    <div className={`flex items-center gap-2 mt-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <p className="text-xs text-gray-400">
                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                      {/* Speaker button for AI messages */}
                      {message.role === 'assistant' && (
                        <motion.button
                          onClick={() => speakText(message.content)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 rounded-md text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          title="Listen to this message"
                        >
                          <Volume2 size={14} />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-blue-400/20 backdrop-blur-sm border border-blue-400/30 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">N</span>
                  </div>
                  <div className="flex items-center gap-2 p-4 bg-gradient-to-br from-gray-800/40 to-gray-700/20 backdrop-blur-sm border border-gray-600/20 rounded-2xl">
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 md:p-6 bg-ar-black/40 backdrop-blur-xl border-t border-blue-500/20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              {/* Voice Button - Outside */}
              <motion.button
                onClick={toggleVoiceMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl transition-all flex-shrink-0 backdrop-blur-sm border ${showVoiceModal
                  ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/15 border-blue-400/50 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800/50 border-gray-600/30 text-gray-300 hover:bg-blue-500/20 hover:border-blue-400/40 hover:text-blue-200'
                  }`}
              >
                <Mic size={18} />
              </motion.button>

              {/* Input with Send Button Inside */}
              <div className="flex-1 relative">
                <motion.input
                  ref={inputRef}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Message Nivi..."
                  className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl px-4 py-3 pr-12 text-white placeholder-blue-200/50 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-all duration-300"
                  disabled={isLoading}
                  whileFocus={{ scale: 1.01 }}
                />

                {/* Send Button - Inside Input */}
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={!currentMessage.trim() || isLoading}
                  whileHover={currentMessage.trim() && !isLoading ? { scale: 1.1 } : {}}
                  whileTap={currentMessage.trim() && !isLoading ? { scale: 0.9 } : {}}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${currentMessage.trim() && !isLoading
                    ? 'bg-gradient-to-r from-blue-600/40 to-blue-500/25 text-white hover:from-blue-600/60 hover:to-blue-500/40 shadow-lg shadow-blue-500/20'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>


          </div>
        </motion.div>
      </div>

      {/* Voice Modal Component */}
      <VoiceModal
        isOpen={showVoiceModal}
        onClose={handleVoiceModalClose}
        onMessageSend={handleSendMessage}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
      />
    </div>
  )
}