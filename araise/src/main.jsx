import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Service Worker update handling
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    // Check for updates every 60 seconds
    setInterval(() => {
      registration.update()
    }, 60000)
    
    // Listen for new service worker
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available, reload to activate
          console.log('New version available! Reloading...')
          window.location.reload()
        }
      })
    })
  })
}

// Add global cache clear function for debugging
window.clearAppCache = () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
    setTimeout(() => {
      window.location.reload()
    }, 500)
  } else {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name))
    }).then(() => {
      window.location.reload()
    })
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
