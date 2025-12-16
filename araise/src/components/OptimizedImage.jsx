/**
 * Simplified optimized image component for WebP images
 * Provides smooth loading transitions and error handling
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  onLoad,
  onError,
  ...props 
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-opacity duration-500`}
      onLoad={onLoad}
      onError={onError}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}

/**
 * Simplified background image component for WebP images
 * Provides smooth loading and overlay support
 */
export function OptimizedBackgroundImage({ 
  src, 
  className = '', 
  children,
  overlay = 'bg-black/40',
  ...props 
}) {
  return (
    <div className={`relative ${className}`} {...props}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{ backgroundImage: `url('${src}')` }}
      />
      
      {/* Overlay */}
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
      
      {/* Content */}
      {children}
    </div>
  )
}
