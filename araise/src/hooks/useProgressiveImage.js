import { useState, useEffect } from 'react'

/**
 * Custom hook for progressive image loading with placeholder support
 * @param {string} src - The actual image source URL
 * @param {string} placeholder - Optional placeholder image (low-res or gradient)
 * @returns {Object} - { src: currentSrc, isLoading, error }
 */
export const useProgressiveImage = (src, placeholder = null) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder || src)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!src) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const img = new Image()
    
    img.onload = () => {
      setCurrentSrc(src)
      setIsLoading(false)
    }
    
    img.onerror = (err) => {
      setError(err)
      setIsLoading(false)
      // Keep placeholder if loading fails
    }
    
    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, placeholder])

  return { src: currentSrc, isLoading, error }
}

/**
 * Preload multiple images
 * @param {Array<string>} sources - Array of image URLs to preload
 * @returns {Promise<void>}
 */
export const preloadImages = (sources) => {
  return Promise.all(
    sources.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = reject
        img.src = src
      })
    })
  )
}

/**
 * Hook to preload images on component mount
 * @param {Array<string>} sources - Array of image URLs to preload
 * @returns {boolean} - Whether all images are loaded
 */
export const useImagePreloader = (sources) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!sources || sources.length === 0) {
      setLoaded(true)
      return
    }

    preloadImages(sources)
      .then(() => setLoaded(true))
      .catch(err => {
        console.warn('Some images failed to preload:', err)
        setLoaded(true) // Still set to true to not block UI
      })
  }, [sources])

  return loaded
}
