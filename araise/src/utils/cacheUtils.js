/**
 * Cache management utilities for production
 */

/**
 * Clear all application caches and reload
 */
export const clearAllCaches = async () => {
  try {
    // Clear service worker caches
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
    }
    
    // Clear browser caches
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
    }
    
    console.log('All caches cleared successfully')
    
    // Reload the page
    window.location.reload(true)
  } catch (error) {
    console.error('Error clearing caches:', error)
  }
}

/**
 * Check if a new version is available
 */
export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.update()
        console.log('Checked for updates')
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
    }
  }
}

/**
 * Get cache version info
 */
export const getCacheInfo = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys()
    return {
      caches: cacheNames,
      count: cacheNames.length
    }
  }
  return { caches: [], count: 0 }
}
