import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause } from "lucide-react"
import { useUserStore } from "../../store/userStore"
import { OptimizedBackgroundImage } from "../OptimizedImage"

const sounds = [
  { 
    id: 'rain', 
    name: 'Rain', 
    description: 'Calming rainfall sounds for deep relaxation',
    image: '/images/mental-health/SoundHealing/rain.webp',
    audioSrc: '/sounds/mental-health/sound healing/Rain.mp3'
  },
  { 
    id: 'ocean', 
    name: 'Ocean Waves', 
    description: 'Soothing ocean waves for peaceful meditation',
    image: '/images/mental-health/SoundHealing/ocean.webp',
    audioSrc: '/sounds/mental-health/sound healing/Ocean.mp3'
  },
  { 
    id: 'forest', 
    name: 'Forest', 
    description: 'Natural forest ambience for stress relief',
    image: '/images/mental-health/SoundHealing/Forest.webp',
    audioSrc: '/sounds/mental-health/sound healing/forest.mp3'
  },
  { 
    id: '40hz', 
    name: '40hz', 
    description: 'Gamma wave frequency for enhanced focus',
    image: '/images/mental-health/SoundHealing/40hz.webp',
    audioSrc: '/sounds/mental-health/sound healing/40hz.mp3'
  },
]

export default function SoundHealing({ onBack }) {
  const [playingSound, setPlayingSound] = useState(null)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const { updateMentalHealthProgress, logSoundHealingSession } = useUserStore()
  const audioRefs = useRef({})

  // Images are now compressed WebP - no preloading needed
  
  const handleBack = async () => {
    // Stop all playing audio and log session before leaving
    if (playingSound && audioRefs.current[playingSound] && sessionStartTime) {
      const sound = sounds.find(s => s.id === playingSound)
      const sessionDurationMinutes = Math.round((Date.now() - sessionStartTime) / 60000)
      if (sessionDurationMinutes >= 1 && sound) {
        await logSoundHealingSession(sound.name, sessionDurationMinutes, sound.id)
        await updateMentalHealthProgress(20)
      }
    }
    
    // Stop and cleanup all audio
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
    
    onBack()
  }

  // Initialize audio objects
  useEffect(() => {
    sounds.forEach(sound => {
      if (!audioRefs.current[sound.id]) {
        const audio = new Audio(sound.audioSrc)
        audio.loop = true
        audio.volume = 0.7
        audioRefs.current[sound.id] = audio
      }
    })

    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause()
        audio.currentTime = 0
      })
    }
  }, [])

  // Enhanced back handler with audio cleanup
  const handleBackWithCleanup = () => {
    // Stop all playing audio
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
    onBack()
  }

  const handlePlaySound = async (soundId) => {
    const currentAudio = audioRefs.current[soundId]
    const sound = sounds.find(s => s.id === soundId)
    
    if (playingSound === soundId) {
      // Stop current sound and log session
      currentAudio.pause()
      currentAudio.currentTime = 0
      
      if (sessionStartTime && sound) {
        const sessionDurationMinutes = Math.round((Date.now() - sessionStartTime) / 60000) // Convert to minutes
        if (sessionDurationMinutes >= 1) { // Only log if session was at least 1 minute
          await logSoundHealingSession(sound.name, sessionDurationMinutes, sound.id)
          await updateMentalHealthProgress(20) // 20% for sound healing session
        }
      }
      
      setPlayingSound(null)
      setSessionStartTime(null)
    } else {
      // Stop any currently playing sound and log its session
      if (playingSound && audioRefs.current[playingSound] && sessionStartTime) {
        const previousSound = sounds.find(s => s.id === playingSound)
        const sessionDurationMinutes = Math.round((Date.now() - sessionStartTime) / 60000)
        if (sessionDurationMinutes >= 1 && previousSound) {
          await logSoundHealingSession(previousSound.name, sessionDurationMinutes, previousSound.id)
          await updateMentalHealthProgress(20)
        }
        
        audioRefs.current[playingSound].pause()
        audioRefs.current[playingSound].currentTime = 0
      }
      
      // Play new sound
      currentAudio.play().catch(error => {
        console.error('Error playing audio:', error)
      })
      setPlayingSound(soundId)
      setSessionStartTime(Date.now())
    }
  }

  return (
    <div className="max-w-2xl mx-auto pt-6 px-4 md:px-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <button
          onClick={handleBack}
          className="text-ar-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-hagrid font-light text-ar-white">🎧 Sound Healing</h1>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {sounds.map((sound, index) => (
          <OptimizedBackgroundImage
            key={sound.id}
            src={sound.image}
            className="overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-900/80 backdrop-blur-sm border border-gray-700/30 group hover:scale-105 transition-all duration-300"
            overlay="bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative p-3 sm:p-6 aspect-square flex flex-col justify-between"
            >
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-hagrid font-bold text-white mb-1 sm:mb-3 leading-tight">{sound.name}</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3">{sound.description}</p>
              </div>
              
              <button
                onClick={() => handlePlaySound(sound.id)}
                className={`w-full py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 border-2 ${
                  playingSound === sound.id
                    ? 'bg-transparent border-red-500 text-red-400 hover:bg-red-500/10'
                    : 'bg-transparent border-green-500 text-green-400 hover:bg-green-500/10'
                } backdrop-blur-sm mt-2 sm:mt-0`}
              >
                {playingSound === sound.id ? (
                  <>
                    <Pause size={16} className="inline mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Stop</span>
                    <span className="sm:hidden">Stop</span>
                  </>
                ) : (
                  <>
                    <Play size={16} className="inline mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Play</span>
                    <span className="sm:hidden">Play</span>
                  </>
                )}
              </button>
            </motion.div>
          </OptimizedBackgroundImage>
        ))}
      </div>
    </div>
  )
}