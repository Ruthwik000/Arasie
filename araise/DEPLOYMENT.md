# Deployment Guide - Cache Fix

## Changes Made

### 1. Service Worker Improvements (v4)
- **Network First** strategy for HTML/navigation (ensures fresh header/footer)
- **Cache First** strategy for static assets (JS, CSS, images)
- Automatic cache cleanup on activation
- Development mode skips all caching
- Proper handling of Vite HMR in development

### 2. Cache Management
- Added automatic service worker updates every 60 seconds
- Added global `window.clearAppCache()` function for debugging
- Added "Clear Cache" button in Settings page
- Cache utilities in `src/utils/cacheUtils.js`

### 3. Production Deployment Steps

#### Before Deploying:
1. **Build the project:**
   ```bash
   cd araise
   npm run build
   ```

2. **Test the production build locally:**
   ```bash
   npm run preview
   ```

#### Deploy to Production:
1. **Upload the `dist` folder** to your hosting service (Vercel, Netlify, etc.)

2. **Force cache clear for existing users:**
   - The service worker version is now `v4`, which will automatically clear old caches
   - Users will get the new version on their next visit

#### After Deployment:
1. **Test the production site:**
   - Open in incognito/private window
   - Check that header and footer appear correctly
   - Navigate between pages to ensure routing works

2. **If users still see cached content:**
   - They can go to Settings → Data & Storage → Clear Cache
   - Or open browser console and run: `window.clearAppCache()`
   - Or hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

### 4. Cache Strategy Explained

**Network First (HTML/Navigation):**
- Always tries to fetch fresh content from network
- Falls back to cache only if offline
- Ensures header, footer, and navigation are always up-to-date

**Cache First (Static Assets):**
- Serves from cache immediately for fast loading
- Updates cache in background
- Perfect for JS, CSS, images, fonts

### 5. Troubleshooting

**If header/footer still don't show:**
1. Check browser console for errors
2. Clear cache using Settings page
3. Unregister service worker:
   - Chrome DevTools → Application → Service Workers → Unregister
4. Hard refresh the page

**For developers:**
- Service worker is disabled in development (localhost)
- Use `npm run dev` for development
- Use `npm run build && npm run preview` to test production behavior

### 6. Future Updates

When you make changes and deploy:
1. The service worker will auto-update within 60 seconds
2. Users will automatically get the new version
3. No manual cache clearing needed (usually)

### 7. Emergency Cache Clear

If you need to force all users to clear cache:
1. Update `CACHE_NAME` version in `public/sw.js` (e.g., `v4` → `v5`)
2. Rebuild and deploy
3. Old caches will be automatically deleted

## Files Modified

- `araise/public/sw.js` - Service worker with new caching strategy
- `araise/src/main.jsx` - Auto-update handling
- `araise/index.html` - Service worker registration
- `araise/vite.config.js` - Build configuration with cache busting
- `araise/src/utils/cacheUtils.js` - Cache management utilities (NEW)
- `araise/src/pages/Settings.jsx` - Added clear cache button

## Testing Checklist

- [ ] Build completes without errors
- [ ] Preview shows header and footer
- [ ] Navigation works correctly
- [ ] Service worker registers successfully
- [ ] Cache clears when using Settings button
- [ ] Works in incognito mode
- [ ] Works on mobile devices
