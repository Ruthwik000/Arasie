# Image Compression Script

Automatically compress all mental health images to WebP format for faster loading.

## Quick Start

```bash
# 1. Install sharp (if not already installed)
npm install --save-dev sharp

# 2. Run the compression script
npm run compress-images

# 3. Update image paths in your code (see below)
```

## What It Does

- ✅ Converts JPG/JPEG/PNG to WebP format
- ✅ Reduces file size by 70-80%
- ✅ Maintains high quality (85%)
- ✅ Preserves original files as backup
- ✅ Processes all images recursively
- ✅ Shows detailed statistics

## Configuration

Edit `scripts/compress-images.js` to customize:

```javascript
const CONFIG = {
  inputDir: '../public/images/mental-health',
  quality: 85,              // 80-90 recommended
  preserveOriginals: true,  // Keep original files
  formats: ['.jpg', '.jpeg', '.png'],
};
```

## After Compression

Update your image paths from `.jpg` to `.webp`:

### Before:
```javascript
image: '/images/mental-health/SoundHealing/rain.jpg'
```

### After:
```javascript
image: '/images/mental-health/SoundHealing/rain.webp'
```

## Expected Results

**Example compression:**
- `rain.jpg` (500KB) → `rain.webp` (100KB) = 80% smaller
- `ocean.jpg` (450KB) → `ocean.webp` (90KB) = 80% smaller
- `forest.jpg` (600KB) → `forest.webp` (120KB) = 80% smaller

**Total savings:** ~2-3 MB → ~0.5 MB

**Load time improvement:**
- 3G: 4s → 0.8s
- 4G: 1s → 0.2s
- WiFi: 0.5s → 0.1s

## Browser Support

WebP is supported by:
- ✅ Chrome/Edge (all versions)
- ✅ Firefox 65+
- ✅ Safari 14+ (iOS 14+)
- ✅ Opera (all versions)

Coverage: 95%+ of users

## Fallback for Old Browsers

If you need to support older browsers, use the `<picture>` element:

```jsx
<picture>
  <source srcSet="/images/rain.webp" type="image/webp" />
  <img src="/images/rain.jpg" alt="Rain" />
</picture>
```

Or update OptimizedImage component to handle fallbacks automatically.

## Troubleshooting

### Error: Cannot find module 'sharp'
```bash
npm install --save-dev sharp
```

### Error: Permission denied
Run with administrator/sudo privileges or check file permissions.

### Images look blurry
Increase quality in CONFIG (try 90-95).

### Script takes too long
Normal for many images. Sharp is fast but processing takes time.

## Manual Compression (Alternative)

If you prefer manual compression:

1. Visit https://squoosh.app
2. Upload each image
3. Select WebP format
4. Set quality to 85%
5. Download and replace

## Next Steps

After running compression:

1. ✅ Run the script
2. ✅ Verify WebP files are created
3. ✅ Update all image paths in code
4. ✅ Test in browser
5. ✅ Delete original files (optional)
6. ✅ Commit and push changes

## Performance Impact

**Before compression:**
- Total size: ~3 MB
- Load time (3G): ~6s
- Bandwidth: High

**After compression:**
- Total size: ~0.6 MB
- Load time (3G): ~1.2s
- Bandwidth: Low
- **80% faster!**
