const CACHE_NAME = 'araise-v5'
const RUNTIME_CACHE = 'araise-runtime-v5'
const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1'

// Install event - skip waiting to activate immediately
self.addEventListener('install', event => {
  console.log('Service worker installing...')
  
  // Always skip waiting to ensure new version activates immediately
  event.waitUntil(self.skipWaiting())
})

// Fetch event - Network First strategy for HTML, Cache First for assets
self.addEventListener('fetch', event => {
  // In development, skip service worker caching entirely
  if (isDevelopment) {
    return
  }
  
  // Skip POST, PUT, DELETE requests - only cache GET requests
  if (event.request.method !== 'GET') {
    return
  }
  
  // Skip WebSocket and HMR requests
  if (event.request.url.includes('/@vite') || 
      event.request.url.includes('/__vite') ||
      event.request.url.includes('.hot-update.') ||
      event.request.destination === 'websocket') {
    return
  }

  const { request } = event
  const url = new URL(request.url)

  // Network First for HTML/navigation requests (ensures fresh header/footer)
  if (request.mode === 'navigate' || request.destination === 'document' || 
      url.pathname.endsWith('.html') || url.pathname === '/' || 
      !url.pathname.includes('.')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the fresh response
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then(cachedResponse => {
            return cachedResponse || caches.match('/')
          })
        })
    )
    return
  }

  // Cache First for static assets (JS, CSS, images, fonts)
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.destination === 'font' ||
      url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          // Return cached version and update in background
          fetch(request).then(response => {
            if (response && response.status === 200) {
              caches.open(RUNTIME_CACHE).then(cache => {
                cache.put(request, response)
              })
            }
          }).catch(() => {})
          return cachedResponse
        }
        
        // Not in cache, fetch from network
        return fetch(request).then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseToCache)
            })
          }
          return response
        })
      })
    )
    return
  }

  // Network First for API calls and other requests
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          const responseToCache = response.clone()
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(request)
      })
  )
})

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', event => {
  console.log('Service worker activating...')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete all old caches
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service worker activated')
      // Take control of all pages immediately
      return self.clients.claim()
    })
  )
})

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  // Clear cache on demand
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
      }).then(() => {
        console.log('All caches cleared')
        return self.clients.matchAll()
      }).then(clients => {
        clients.forEach(client => client.postMessage({ type: 'CACHE_CLEARED' }))
      })
    )
  }
})

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered')
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Sync offline data when connection is restored
  return new Promise(resolve => {
    console.log('Performing background sync...')
    
    // Here you could sync any offline data stored in IndexedDB
    // For now, we'll just resolve
    setTimeout(() => {
      console.log('Background sync completed')
      resolve()
    }, 1000)
  })
}

// Push notification handling
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Open App',
          icon: '/icon-192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Araise', options)
    )
  }
})

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Notification click received.')
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'))
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow('/'))
  }
})
