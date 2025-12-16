import { useState } from 'react'
import { useProgressiveImage } from '../hooks/useProgressiveImage'

/**
 * Optimized image component with progressive loading and blur effect
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  showLoader = true,
  fallbackGradient = 'from-gray-800 to-gray-900',
  onLoad,
  onError,
  ...props 
}) {
  const { src: currentSrc, isLoading, error } = useProgressiveImage(src, placeholder)
  const [imageError, setImageError] = useState(false)

  const handleError = (e) => {
    setImageError(true)
    if (onError) onError(e)
  }

  const handleLoad = (e) => {
    if (onLoad) onLoad(e)
  }

  // Show gradient fallback if image fails to load
  if (error || imageError) {
    return (
      <div 
        className={`bg-gradient-to-br ${fallbackGradient} ${className}`}
        role="img"
        aria-label={alt}
        {...props}
      />
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {isLoading && showLoader && (
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} animate-pulse`} />
      )}
      
      {/* Actual image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </div>
  )
}

/**
 * Background image component with progressive loading
 */
export function OptimizedBackgroundImage({ 
  src, 
  className = '', 
  children,
  placeholder = null,
  fallbackGradient = 'from-gray-800 to-gray-900',
  overlay = 'bg-black/40',
  preload = false,
  ...props 
}) {
  const { src: currentSrc, isLoading, error } = useProgressiveImage(src, placeholder)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Preload image if requested
  useState(() => {
    if (preload && src) {
      const img = new Image()
      img.src = src
      img.onload = () => setImageLoaded(true)
    }
  })

  // Show gradient fallback if image fails to load
  if (error || imageError) {
    return (
      <div className={`relative ${className}`} {...props}>
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient}`} />
        {overlay && <div className={`absolute inset-0 ${overlay}`} />}
        {children}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Loading skeleton - subtle, no animation */}
      {isLoading && !imageLoaded && (
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient}`} />
      )}
      
      {/* Background image */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
          isLoading && !imageLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url('${currentSrc}')` }}
        onError={() => setImageError(true)}
      />
      
      {/* Overlay */}
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
      
      {/* Content */}
      {children}
    </div>
  )
}
