import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"


// ChatGPT-style Voice Orb
function ParticleSphere({ audioLevel, isListening }) {
    return (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            {/* 3D Sphere Base */}
            <motion.div
                className="relative w-80 h-80 rounded-full"
                style={{
                    background: `radial-gradient(circle at 25% 25%, 
                        rgba(255, 255, 255, ${0.95 + (isListening ? audioLevel * 0.05 : 0)}) 0%,
                        rgba(255, 255, 255, ${0.8 + (isListening ? audioLevel * 0.1 : 0)}) 8%,
                        rgba(147, 197, 253, ${0.9 + (isListening ? audioLevel * 0.1 : 0)}) 15%,
                        rgba(59, 130, 246, ${0.85 + (isListening ? audioLevel * 0.15 : 0)}) 35%,
                        rgba(37, 99, 235, ${0.8 + (isListening ? audioLevel * 0.2 : 0)}) 60%,
                        rgba(29, 78, 216, ${0.7 + (isListening ? audioLevel * 0.2 : 0)}) 80%,
                        rgba(30, 64, 175, ${0.6 + (isListening ? audioLevel * 0.1 : 0)}) 95%,
                        rgba(23, 37, 84, ${0.8 + (isListening ? audioLevel * 0.2 : 0)}) 100%)`,
                    boxShadow: `
                        0 0 ${60 + (isListening ? audioLevel * 100 : 0)}px rgba(59, 130, 246, ${0.5 + (isListening ? audioLevel * 0.4 : 0)}),
                        0 0 ${120 + (isListening ? audioLevel * 120 : 0)}px rgba(147, 197, 253, ${0.3 + (isListening ? audioLevel * 0.3 : 0)}),
                        inset -20px -20px 60px rgba(30, 64, 175, ${0.4 + (isListening ? audioLevel * 0.3 : 0)}),
                        inset 20px 20px 60px rgba(255, 255, 255, ${0.2 + (isListening ? audioLevel * 0.1 : 0)}),
                        inset 0 0 40px rgba(59, 130, 246, ${0.1 + (isListening ? audioLevel * 0.2 : 0)})
                    `,
                    filter: `blur(${isListening && audioLevel ? audioLevel * 2 : 0}px)`,
                    transform: isListening && audioLevel
                        ? `scale(${1 + audioLevel * 0.15}) rotate(${audioLevel * 8}deg)`
                        : 'scale(1) rotate(0deg)'
                }}
                animate={isListening ? (audioLevel ? {
                    // Active speaking animation
                    scale: [1, 1.1 + audioLevel * 0.2, 0.95 + audioLevel * 0.15, 1.05 + audioLevel * 0.18, 1],
                    rotate: [0, audioLevel * 12, -audioLevel * 8, audioLevel * 15, 0],
                    x: [0, audioLevel * 6, -audioLevel * 4, audioLevel * 3, 0],
                    y: [0, -audioLevel * 4, audioLevel * 5, -audioLevel * 2, 0]
                } : {
                    // Listening but not speaking
                    scale: [1, 1.02, 1]
                }) : {
                    // Idle state
                    scale: [1, 1.01, 1]
                }}
                transition={isListening ? (audioLevel ? {
                    duration: 0.4 + audioLevel * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                } : {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }) : {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Sphere highlight */}
            <motion.div
                className="absolute w-32 h-32 rounded-full top-16 left-16"
                style={{
                    background: `radial-gradient(circle, 
                        rgba(255, 255, 255, ${0.8 + (isListening ? audioLevel * 0.2 : 0)}) 0%,
                        rgba(255, 255, 255, ${0.4 + (isListening ? audioLevel * 0.3 : 0)}) 40%,
                        transparent 70%)`,
                    filter: 'blur(8px)'
                }}
                animate={{
                    scale: [1, 1.1 + (isListening ? audioLevel * 0.3 : 0), 1],
                    opacity: [0.6, 0.9 + (isListening ? audioLevel * 0.1 : 0), 0.6]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Sphere reflection */}
            <motion.div
                className="absolute w-20 h-20 rounded-full top-20 left-20"
                style={{
                    background: `radial-gradient(circle, 
                        rgba(255, 255, 255, ${0.9 + (isListening ? audioLevel * 0.1 : 0)}) 0%,
                        rgba(255, 255, 255, ${0.3 + (isListening ? audioLevel * 0.2 : 0)}) 60%,
                        transparent 100%)`,
                    filter: 'blur(4px)'
                }}
                animate={{
                    scale: [0.8, 1.2 + (isListening ? audioLevel * 0.4 : 0), 0.8],
                    opacity: [0.4, 0.8 + (isListening ? audioLevel * 0.2 : 0), 0.4]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Voice-reactive ripples when listening */}
            {isListening && (
                <>
                    {/* Inner ripple - more intense when speaking */}
                    <motion.div
                        className="absolute w-96 h-96 rounded-full border-2"
                        style={{
                            borderColor: `rgba(59, 130, 246, ${0.3 + audioLevel * 0.5})`,
                            filter: 'blur(1px)'
                        }}
                        animate={audioLevel ? {
                            scale: [1, 1.4 + audioLevel * 0.6, 1],
                            opacity: [0, 0.8 + audioLevel * 0.2, 0],
                            rotate: [0, audioLevel * 30, 0]
                        } : {
                            scale: [1, 1.2, 1],
                            opacity: [0, 0.4, 0]
                        }}
                        transition={audioLevel ? {
                            duration: 0.8 - audioLevel * 0.3,
                            repeat: Infinity,
                            ease: "easeOut"
                        } : {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                    />

                    {/* Outer ripple - more dynamic when speaking */}
                    <motion.div
                        className="absolute w-[28rem] h-[28rem] rounded-full border"
                        style={{
                            borderColor: `rgba(147, 197, 253, ${0.2 + audioLevel * 0.4})`,
                            filter: 'blur(2px)'
                        }}
                        animate={audioLevel ? {
                            scale: [1, 1.5 + audioLevel * 0.8, 1],
                            opacity: [0, 0.6 + audioLevel * 0.4, 0],
                            rotate: [0, -audioLevel * 20, 0]
                        } : {
                            scale: [1, 1.3, 1],
                            opacity: [0, 0.3, 0]
                        }}
                        transition={audioLevel ? {
                            duration: 1.2 - audioLevel * 0.4,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.2
                        } : {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.3
                        }}
                    />

                    {/* Extra ripple when actively speaking */}

                </>
            )}

            {/* Subtle outer glow */}
            <motion.div
                className="absolute w-[30rem] h-[30rem] rounded-full"
                style={{
                    background: `radial-gradient(circle, 
                        transparent 70%, 
                        rgba(59, 130, 246, ${0.1 + (isListening ? audioLevel * 0.2 : 0)}) 85%, 
                        transparent 100%)`,
                    filter: 'blur(10px)'
                }}
                animate={{
                    scale: [1, 1.05 + (isListening ? audioLevel * 0.1 : 0), 1],
                    opacity: [0.5, 0.8 + (isListening ? audioLevel * 0.2 : 0), 0.5]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    )
}

export default function VoiceModal({
    isOpen,
    onClose,
    onMessageSend,
    currentMessage,
    setCurrentMessage
}) {
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [audioLevel, setAudioLevel] = useState(0)
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
    const [pendingResponse, setPendingResponse] = useState(null)
    const [responseQueue, setResponseQueue] = useState([])

    const recognitionRef = useRef(null)
    const synthRef = useRef(null)
    const audioContextRef = useRef(null)
    const analyserRef = useRef(null)
    const microphoneRef = useRef(null)
    const mediaStreamRef = useRef(null) // Store the media stream to stop it later
    const instanceIdRef = useRef(`voice-modal-${Date.now()}`)

    // Initialize speech recognition and synthesis
    useEffect(() => {
        // Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = true
            recognitionRef.current.interimResults = true
            recognitionRef.current.lang = 'en-US'

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('')

                setCurrentMessage(transcript)
            }

            recognitionRef.current.onend = () => {
                setIsListening(false)
                // Don't auto-send on end - only send when user explicitly clicks Done
            }

            recognitionRef.current.onerror = (event) => {
                setIsListening(false)

                switch (event.error) {
                    case 'not-allowed':
                        alert('Microphone access denied. Please allow microphone permissions.')
                        onClose()
                        break
                    case 'network':
                        if (!navigator.onLine) {
                            alert('You appear to be offline. Please check your internet connection.')
                        }
                        break
                    case 'no-speech':
                        // Don't show error for no speech, this is normal
                        break
                    case 'aborted':
                        // User cancelled, don't show error
                        break
                    default:
                        console.warn('Speech recognition error:', event.error)
                        break
                }
            }
        }

        // Speech Synthesis
        if ('speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop()
                } catch (error) {
                    console.warn('Error stopping recognition:', error)
                }
            }
            if (synthRef.current && synthRef.current.speaking) {
                try {
                    synthRef.current.cancel()
                } catch (error) {
                    console.warn('Error cancelling speech:', error)
                }
            }
            // Stop microphone stream on unmount
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => {
                    track.stop()
                })
                mediaStreamRef.current = null
            }
        }
    }, [])

    // Start listening when modal opens
    useEffect(() => {
        if (isOpen && recognitionRef.current) {
            startListening()
        }

        return () => {
            // Cleanup when modal closes
            try {
                if (recognitionRef.current) {
                    recognitionRef.current.stop()
                }
                if (synthRef.current && synthRef.current.speaking) {
                    synthRef.current.cancel()
                }
                // Stop microphone stream
                stopMicrophoneStream()
                // Close audio context
                if (audioContextRef.current && audioContextRef.current.state !== 'closed' && audioContextRef.current.state !== 'closing') {
                    audioContextRef.current.close().catch(err => console.warn('AudioContext close error:', err))
                }
            } catch (error) {
                console.warn('Cleanup error:', error)
            }
            setIsListening(false)
            setIsSpeaking(false)
            setIsWaitingForResponse(false)
        }
    }, [isOpen])

    // Audio visualization setup
    const setupAudioVisualization = async () => {
        try {
            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.warn('getUserMedia not supported, skipping audio visualization')
                return
            }

            // Request microphone access with mobile-friendly constraints
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    // Mobile-friendly constraints
                    sampleRate: 44100,
                    channelCount: 1
                }
            })

            // Store the stream so we can stop it later
            mediaStreamRef.current = stream

            // Only create new AudioContext if one doesn't exist or is closed
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext
                audioContextRef.current = new AudioContextClass()
            }

            // Resume audio context if suspended (common on mobile)
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume()
            }

            analyserRef.current = audioContextRef.current.createAnalyser()
            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)

            analyserRef.current.fftSize = 256
            analyserRef.current.smoothingTimeConstant = 0.8
            microphoneRef.current.connect(analyserRef.current)

            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

            const updateAudioLevel = () => {
                if (isListening && analyserRef.current) {
                    analyserRef.current.getByteFrequencyData(dataArray)
                    const average = dataArray.reduce((a, b) => a + b) / dataArray.length
                    const normalizedLevel = Math.min(average / 255, 1)
                    setAudioLevel(normalizedLevel)

                    requestAnimationFrame(updateAudioLevel)
                }
            }

            updateAudioLevel()
        } catch (error) {
            console.error('Error accessing microphone:', error)
            // Re-throw to be handled by caller
            throw error
        }
    }

    // Function to stop microphone stream
    const stopMicrophoneStream = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => {
                track.stop()
            })
            mediaStreamRef.current = null
        }
    }

    // Text-to-speech function
    const speakText = (text) => {
        if (!synthRef.current || !text) return

        try {
            // Cancel any ongoing speech
            if (synthRef.current.speaking) {
                synthRef.current.cancel()
            }

            const utterance = new SpeechSynthesisUtterance(text)
            utterance.rate = 0.9
            utterance.pitch = 1
            utterance.volume = 0.8

            utterance.onstart = () => {
                setIsSpeaking(true)
                setIsWaitingForResponse(false)
            }
            
            utterance.onend = () => {
                setIsSpeaking(false)
                // Process next response in queue if any
                setResponseQueue(prev => {
                    if (prev.length > 0) {
                        const [nextResponse, ...rest] = prev
                        setTimeout(() => speakText(nextResponse), 500)
                        return rest
                    }
                    // After AI finishes speaking, automatically start listening again
                    setTimeout(() => {
                        if (isOpen) {
                            startListening()
                        }
                    }, 500)
                    return []
                })
            }
            
            utterance.onerror = () => {
                setIsSpeaking(false)
                setIsWaitingForResponse(false)
            }

            synthRef.current.speak(utterance)
        } catch (error) {
            console.error('Error in text-to-speech:', error)
            setIsSpeaking(false)
            setIsWaitingForResponse(false)
        }
    }

    // Handle incoming AI response with queue
    useEffect(() => {
        if (pendingResponse && isOpen && !isListening && !isSpeaking) {
            speakText(pendingResponse)
            setPendingResponse(null)
        } else if (pendingResponse && (isListening || isSpeaking)) {
            // Add to queue if currently busy
            setResponseQueue(prev => [...prev, pendingResponse])
            setPendingResponse(null)
        }
    }, [pendingResponse, isOpen, isListening, isSpeaking])

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop()
            } catch (error) {
                console.warn('Error stopping speech recognition:', error)
            }
            setIsListening(false)
        }
        // Stop the microphone stream
        stopMicrophoneStream()
    }

    const startListening = async () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Speech recognition not supported in this browser.')
            return
        }

        // Check internet connection
        if (!navigator.onLine) {
            alert('You appear to be offline. Voice chat requires an internet connection.')
            return
        }

        // Check if microphone permission is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Microphone access is not supported on this device.')
            return
        }

        try {
            // Request microphone permission first (especially important for mobile)
            setIsListening(true)
            await setupAudioVisualization()

            // Small delay to ensure audio context is ready
            setTimeout(() => {
                if (recognitionRef.current) {
                    try {
                        recognitionRef.current.start()
                    } catch (error) {
                        console.warn('Failed to start speech recognition:', error)
                        setIsListening(false)
                        stopMicrophoneStream()
                        
                        // Provide user-friendly error message
                        if (error.message && error.message.includes('already started')) {
                            // Recognition already running, ignore
                            return
                        }
                        alert('Unable to start voice recognition. Please try again.')
                    }
                }
            }, 300)
        } catch (error) {
            console.error('Error starting listening:', error)
            setIsListening(false)
            stopMicrophoneStream()
            
            // Handle specific permission errors
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                alert('Microphone permission denied. Please allow microphone access in your browser settings and try again.')
            } else if (error.name === 'NotFoundError') {
                alert('No microphone found. Please connect a microphone and try again.')
            } else {
                alert('Unable to access microphone. Please check your device settings and try again.')
            }
        }
    }

    // Expose speakText function to parent - use pending response pattern with instance tracking
    useEffect(() => {
        if (isOpen) {
            const instanceId = instanceIdRef.current
            if (!window.voiceModalInstances) {
                window.voiceModalInstances = {}
            }
            window.voiceModalInstances[instanceId] = (text) => {
                setPendingResponse(text)
            }
            // Set the latest instance as the active one
            window.voiceModalSpeakText = window.voiceModalInstances[instanceId]
        }
        return () => {
            const instanceId = instanceIdRef.current
            if (window.voiceModalInstances && window.voiceModalInstances[instanceId]) {
                delete window.voiceModalInstances[instanceId]
            }
            // Clean up global function if this was the active instance
            if (window.voiceModalSpeakText === window.voiceModalInstances?.[instanceId]) {
                delete window.voiceModalSpeakText
            }
        }
    }, [isOpen])

    // Prevent body scroll when modal is open (with iOS fix)
    useEffect(() => {
        if (isOpen) {
            // Store current scroll position
            const scrollY = window.scrollY
            
            // Apply styles to prevent scroll
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = '100%'
            document.body.style.height = '100vh'
            
            // Prevent iOS bounce/rubber-band effect
            document.body.style.touchAction = 'none'
            
            return () => {
                // Restore scroll position
                const scrollY = document.body.style.top
                document.body.style.overflow = ''
                document.body.style.position = ''
                document.body.style.top = ''
                document.body.style.width = ''
                document.body.style.height = ''
                document.body.style.touchAction = ''
                
                // Restore scroll position
                if (scrollY) {
                    window.scrollTo(0, parseInt(scrollY || '0') * -1)
                }
            }
        }
    }, [isOpen])

    return (
        <AnimatePresence mode="wait" onExitComplete={() => {
            // Ensure cleanup after animation completes
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.width = ''
        }}>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
                    style={{ 
                        isolation: 'isolate',
                        touchAction: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {/* Enhanced Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />



                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-8"
                    >
                        {/* Siri-like Orb */}
                        <div className="relative mb-12 flex items-center justify-center">
                            <motion.button
                                onClick={isListening ? stopListening : startListening}
                                className="relative w-64 h-64 flex items-center justify-center focus:outline-none cursor-pointer"
                                animate={{
                                    scale: isListening ? [1, 1.02, 1] : isSpeaking ? [1, 1.01, 1] : 1,
                                }}
                                transition={{
                                    scale: {
                                        duration: 2,
                                        repeat: (isListening || isSpeaking) ? Infinity : 0,
                                        ease: "easeInOut"
                                    }
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{
                                    scale: 0.95,
                                    transition: { duration: 0.1 }
                                }}

                            >
                                {/* Fluid Sphere Animation Container */}
                                <motion.div
                                    className="relative w-80 h-80 flex items-center justify-center"
                                    animate={{
                                        scale: !isListening && !isSpeaking ? [1, 1.005, 1] : 1
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: (!isListening && !isSpeaking) ? Infinity : 0,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {/* Fluid Sphere - All States */}
                                    <motion.div
                                        className="absolute rounded-full overflow-hidden"
                                        style={{
                                            width: '240px',
                                            height: '240px',
                                            left: 'calc(50% - 120px)',
                                            top: 'calc(50% - 120px)',
                                            background: `radial-gradient(circle at ${30 + (isListening ? audioLevel * 20 : 0)}% ${30 + (isListening ? audioLevel * 15 : 0)}%, 
                                                rgba(59, 130, 246, ${0.9 + (isListening ? audioLevel * 0.1 : 0)}) 0%, 
                                                rgba(37, 99, 235, ${0.7 + (isListening ? audioLevel * 0.2 : 0)}) 30%, 
                                                rgba(29, 78, 216, ${0.5 + (isListening ? audioLevel * 0.3 : 0)}) 60%, 
                                                rgba(30, 64, 175, ${0.3 + (isListening ? audioLevel * 0.2 : 0)}) 100%)`,
                                            boxShadow: `
                                                inset 0 0 ${60 + (isListening ? audioLevel * 40 : 0)}px rgba(59, 130, 246, ${0.4 + (isListening ? audioLevel * 0.3 : 0)}),
                                                0 0 ${80 + (isListening ? audioLevel * 60 : 0)}px rgba(59, 130, 246, ${0.3 + (isListening ? audioLevel * 0.4 : 0)}),
                                                0 0 ${120 + (isListening ? audioLevel * 80 : 0)}px rgba(37, 99, 235, ${0.2 + (isListening ? audioLevel * 0.3 : 0)})
                                            `,
                                            filter: `blur(${isListening ? 0.3 + audioLevel * 0.5 : 0.8}px)`,
                                            backdropFilter: 'blur(20px)',
                                            opacity: isListening ? 0 : 1,
                                            display: isListening ? 'none' : 'block'
                                        }}
                                        animate={{
                                            scale: isListening
                                                ? [1, 1.05 + audioLevel * 0.1, 1]
                                                : isSpeaking
                                                    ? [1, 1.03, 1]
                                                    : [1, 1.01, 1],
                                        }}
                                        transition={{
                                            duration: isListening ? 0.5 : isSpeaking ? 1.5 : 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {/* Flowing internal blobs */}
                                        {[...Array(isListening ? 15 : isSpeaking ? 12 : 8)].map((_, i) => (
                                            <motion.div
                                                key={`fluid-blob-${i}`}
                                                className="absolute rounded-full"
                                                style={{
                                                    width: `${20 + Math.sin(i * 0.7) * (isListening ? 25 + audioLevel * 20 : 15)}px`,
                                                    height: `${20 + Math.sin(i * 0.7) * (isListening ? 25 + audioLevel * 20 : 15)}px`,
                                                    left: `${20 + (i * 25) % 200}px`,
                                                    top: `${30 + Math.sin(i * 1.2) * 80}px`,
                                                    background: `rgba(${120 + i * 8}, ${160 + i * 6}, 255, ${0.4 + Math.sin(i * 0.5) * 0.3 + (isListening ? audioLevel * 0.4 : 0)})`,
                                                    filter: `blur(${8 + (isListening ? audioLevel * 6 : 0)}px)`
                                                }}
                                                animate={{
                                                    x: [0, Math.sin(i * 0.8) * (isListening ? 60 + audioLevel * 40 : 40), 0],
                                                    y: [0, Math.cos(i * 0.6) * (isListening ? 50 + audioLevel * 30 : 30), 0],
                                                    scale: isListening
                                                        ? [1, 1.5 + audioLevel * 0.8, 1]
                                                        : isSpeaking
                                                            ? [1, 1.3, 1]
                                                            : [1, 1.2, 1],
                                                    opacity: isListening
                                                        ? [0.5, 0.9 + audioLevel * 0.1, 0.5]
                                                        : [0.4, 0.7, 0.4]
                                                }}
                                                transition={{
                                                    duration: isListening
                                                        ? 2 + i * 0.2
                                                        : isSpeaking
                                                            ? 4 + i * 0.3
                                                            : 6 + i * 0.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                    delay: i * 0.2
                                                }}
                                            />
                                        ))}

                                        {/* New Violet Particle System for listening state - DISABLED for 3D sphere */}
                                        {false && isListening && (
                                            <>
                                                {/* Dense particle field */}
                                                {[...Array(200)].map((_, i) => {
                                                    const angle = (i / 200) * 2 * Math.PI * 3 // Multiple spirals
                                                    const radius = (i / 200) * 100 + Math.sin(i * 0.1) * 20
                                                    const x = Math.cos(angle) * radius + 120
                                                    const y = Math.sin(angle) * radius + 120

                                                    return (
                                                        <motion.div
                                                            key={`particle-${i}`}
                                                            className="absolute rounded-full"
                                                            style={{
                                                                width: `${1 + Math.random() * 2 + audioLevel * 2}px`,
                                                                height: `${1 + Math.random() * 2 + audioLevel * 2}px`,
                                                                left: `${x}px`,
                                                                top: `${y}px`,
                                                                background: `rgba(${100 + Math.random() * 155}, ${150 + Math.random() * 105}, 255, ${0.6 + Math.random() * 0.4 + audioLevel * 0.3})`,
                                                                boxShadow: `0 0 ${2 + Math.random() * 4}px rgba(100, 150, 255, 0.8)`
                                                            }}
                                                            animate={{
                                                                x: [0, Math.sin(angle + audioLevel * 5) * (10 + audioLevel * 15), 0],
                                                                y: [0, Math.cos(angle + audioLevel * 5) * (10 + audioLevel * 15), 0],
                                                                scale: [0.5, 1.5 + audioLevel * 1.5, 0.5],
                                                                opacity: [0.3, 1, 0.3],
                                                                rotate: [0, 360, 0]
                                                            }}
                                                            transition={{
                                                                duration: 0.5 + Math.random() * 1.5,
                                                                repeat: Infinity,
                                                                ease: "easeInOut",
                                                                delay: Math.random() * 2
                                                            }}
                                                        />
                                                    )
                                                })}

                                                {/* Swirling particle streams */}
                                                {[...Array(50)].map((_, i) => {
                                                    const streamAngle = (i / 50) * 2 * Math.PI
                                                    const streamRadius = 60 + Math.sin(i * 0.3) * 40
                                                    const x = Math.cos(streamAngle) * streamRadius + 120
                                                    const y = Math.sin(streamAngle) * streamRadius + 120

                                                    return (
                                                        <motion.div
                                                            key={`stream-particle-${i}`}
                                                            className="absolute rounded-full"
                                                            style={{
                                                                width: `${2 + audioLevel * 3}px`,
                                                                height: `${2 + audioLevel * 3}px`,
                                                                left: `${x}px`,
                                                                top: `${y}px`,
                                                                background: `rgba(${120 + i * 2}, ${180 + i * 1}, 255, ${0.8 + audioLevel * 0.2})`,
                                                                boxShadow: `0 0 ${6 + audioLevel * 8}px rgba(120, 180, 255, 0.9)`
                                                            }}
                                                            animate={{
                                                                x: [0, Math.sin(streamAngle * 2 + audioLevel * 10) * (20 + audioLevel * 25), 0],
                                                                y: [0, Math.cos(streamAngle * 2 + audioLevel * 10) * (20 + audioLevel * 25), 0],
                                                                scale: [1, 2 + audioLevel * 2, 1],
                                                                opacity: [0.6, 1, 0.6]
                                                            }}
                                                            transition={{
                                                                duration: 0.3 + (i % 10) * 0.05,
                                                                repeat: Infinity,
                                                                ease: "easeInOut",
                                                                delay: i * 0.02
                                                            }}
                                                        />
                                                    )
                                                })}

                                                {/* Central particle vortex */}
                                                {[...Array(30)].map((_, i) => {
                                                    const vortexAngle = (i / 30) * 2 * Math.PI + audioLevel * 20
                                                    const vortexRadius = 20 + (i / 30) * 30
                                                    const x = Math.cos(vortexAngle) * vortexRadius + 120
                                                    const y = Math.sin(vortexAngle) * vortexRadius + 120

                                                    return (
                                                        <motion.div
                                                            key={`vortex-particle-${i}`}
                                                            className="absolute rounded-full"
                                                            style={{
                                                                width: `${3 + audioLevel * 4}px`,
                                                                height: `${3 + audioLevel * 4}px`,
                                                                left: `${x}px`,
                                                                top: `${y}px`,
                                                                background: `rgba(150, 200, 255, ${0.9 + audioLevel * 0.1})`,
                                                                boxShadow: `0 0 ${8 + audioLevel * 12}px rgba(150, 200, 255, 1)`
                                                            }}
                                                            animate={{
                                                                rotate: [0, 360, 0],
                                                                scale: [0.8, 1.8 + audioLevel * 1.5, 0.8],
                                                                opacity: [0.7, 1, 0.7]
                                                            }}
                                                            transition={{
                                                                duration: 0.2 + audioLevel * 0.3,
                                                                repeat: Infinity,
                                                                ease: "easeInOut",
                                                                delay: i * 0.01
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </>
                                        )}
                                    </motion.div>
                                </motion.div>

                                {/* CSS Particle Sphere for listening state */}
                                {isListening && (
                                    <ParticleSphere audioLevel={audioLevel} isListening={isListening} />
                                )}

                                {isSpeaking && (
                                    <>
                                        {/* Speaking - Flowing outer streams */}
                                        {[...Array(16)].map((_, i) => {
                                            const outerAngle = (i / 16) * 2 * Math.PI
                                            const outerRadius = 140
                                            const outerX = Math.cos(outerAngle) * outerRadius
                                            const outerY = Math.sin(outerAngle) * outerRadius

                                            return (
                                                <motion.div
                                                    key={`speaking-outer-${i}`}
                                                    className="absolute rounded-full"
                                                    style={{
                                                        width: '3px',
                                                        height: '3px',
                                                        left: `calc(50% + ${outerX}px)`,
                                                        top: `calc(50% + ${outerY}px)`,
                                                        background: `hsl(${220 + (i * 10) % 80}, 70%, 65%)`,
                                                        boxShadow: `0 0 6px hsl(${220 + (i * 10) % 80}, 70%, 65%)`
                                                    }}
                                                    animate={{
                                                        opacity: [0.2, 0.7, 0.2],
                                                        scale: [0.5, 1.5, 0.5],
                                                        rotate: [0, 360, 0]
                                                    }}
                                                    transition={{
                                                        duration: 3 + (i % 8) * 0.2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        delay: i * 0.1
                                                    }}
                                                />
                                            )
                                        })}
                                    </>
                                )}

                                {!isListening && !isSpeaking && (
                                    <>
                                        {/* Standby - Gentle pulse rings */}
                                        <motion.div
                                            className="absolute inset-0 rounded-full border border-blue-400/20"
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0, 0.4, 0]
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />

                                        <motion.div
                                            className="absolute inset-0 rounded-full border border-blue-300/15"
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0, 0.3, 0]
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 1
                                            }}
                                        />
                                    </>
                                )}


                            </motion.button>
                        </div>

                        {/* Enhanced Siri-like Status Text */}
                        <motion.div
                            key={isListening ? 'listening' : isSpeaking ? 'speaking' : 'ready'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-16"
                        >
                            <motion.h1
                                className="text-4xl font-light text-white mb-4"
                                animate={{
                                    opacity: isListening ? [1, 0.7, 1] : 1,
                                    scale: isListening ? [1, 1.02, 1] : 1
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: isListening ? Infinity : 0,
                                    ease: "easeInOut"
                                }}
                            >
                                {isListening 
                                    ? 'Listening...' 
                                    : isWaitingForResponse 
                                    ? 'Thinking...'
                                    : isSpeaking 
                                    ? 'Speaking...' 
                                    : 'Voice Chat'}
                            </motion.h1>

                            <motion.p
                                className="text-lg font-light"
                                style={{
                                    background: isListening
                                        ? `linear-gradient(90deg, 
                                            #ff6b6b ${audioLevel * 100}%, 
                                            #4ecdc4 ${50 + audioLevel * 50}%, 
                                            #45b7d1 100%)`
                                        : 'none',
                                    backgroundClip: isListening ? 'text' : 'unset',
                                    WebkitBackgroundClip: isListening ? 'text' : 'unset',
                                    WebkitTextFillColor: isListening ? 'transparent' : '#9ca3af',
                                    color: isListening ? 'transparent' : '#9ca3af'
                                }}
                                animate={{
                                    opacity: isListening ? [0.7, 1, 0.7] : 1,
                                    y: isListening ? [0, -2, 0] : 0
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: isListening ? Infinity : 0,
                                    ease: "easeInOut"
                                }}
                            >
                                {isListening
                                    ? 'Speak now, I\'m listening to you'
                                    : isWaitingForResponse
                                        ? 'Processing your message...'
                                    : isSpeaking
                                        ? 'Nivi is responding to you'
                                        : 'Click Start or tap the orb to speak with Nivi'
                                }
                            </motion.p>
                        </motion.div>

                        {/* Current Message Display */}
                        {currentMessage && isListening && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-32 left-8 right-8"
                            >
                                <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
                                    <p className="text-white text-base leading-relaxed">{currentMessage}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Bottom Controls */}
                        <div className="absolute bottom-8 flex items-center gap-4">
                            {/* Done/Start Toggle Button */}
                            <motion.button
                                onClick={() => {
                                    if (isListening) {
                                        // Stop listening
                                        stopListening()
                                        // Send message if there's content
                                        if (currentMessage.trim()) {
                                            setIsWaitingForResponse(true)
                                            onMessageSend(currentMessage)
                                            // Clear the current message
                                            setCurrentMessage('')
                                        }
                                    } else if (!isSpeaking && !isWaitingForResponse) {
                                        // Start listening only if not speaking or waiting
                                        startListening()
                                    }
                                }}
                                disabled={isSpeaking || isWaitingForResponse}
                                className={`px-8 py-4 rounded-full backdrop-blur-xl border transition-all duration-300 font-medium text-base ${
                                    isListening
                                        ? 'bg-blue-600/80 border-blue-400/50 text-white hover:bg-blue-500/80 shadow-lg shadow-blue-500/30'
                                        : (isSpeaking || isWaitingForResponse)
                                        ? 'bg-gray-800/40 border-gray-700/30 text-gray-500 cursor-not-allowed opacity-50'
                                        : 'bg-gray-800/60 border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/60'
                                }`}
                                whileHover={!isSpeaking && !isWaitingForResponse ? { scale: 1.05 } : {}}
                                whileTap={!isSpeaking && !isWaitingForResponse ? { scale: 0.95 } : {}}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {isListening ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Done
                                    </span>
                                ) : isWaitingForResponse ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Thinking...
                                    </span>
                                ) : isSpeaking ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        </svg>
                                        Speaking
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                        Start
                                    </span>
                                )}
                            </motion.button>

                            {/* Close Button */}
                            <motion.button
                                onClick={onClose}
                                className="w-16 h-16 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <X size={24} />
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}