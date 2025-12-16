/**
 * Image Compression Script
 * Compresses all images in public/images/mental-health to WebP format
 * Reduces file size by 70-80% while maintaining quality
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '../public/images/mental-health'),
  quality: 85, // WebP quality (80-90 recommended)
  preserveOriginals: true, // Keep original files as backup
  formats: ['.jpg', '.jpeg', '.png'],
};

// Statistics
const stats = {
  processed: 0,
  failed: 0,
  originalSize: 0,
  compressedSize: 0,
};

/**
 * Get all image files recursively
 */
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (CONFIG.formats.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Compress a single image to WebP
 */
async function compressImage(inputPath) {
  try {
    const ext = path.extname(inputPath);
    const outputPath = inputPath.replace(ext, '.webp');

    // Skip if WebP already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping (already exists): ${path.basename(outputPath)}`);
      return;
    }

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    stats.originalSize += originalStats.size;

    // Compress to WebP
    await sharp(inputPath)
      .webp({ quality: CONFIG.quality })
      .toFile(outputPath);

    // Get compressed file size
    const compressedStats = fs.statSync(outputPath);
    
    const reduction = ((1 - compressedStats.size / originalStats.size) * 100).toFixed(1);
    const originalKB = (originalStats.size / 1024).toFixed(1);
    const compressedKB = (compressedStats.size / 1024).toFixed(1);

    // Check if WebP is actually smaller
    if (compressedStats.size >= originalStats.size) {
      // WebP is larger or same size, delete it and keep original
      fs.unlinkSync(outputPath);
      console.log(`⚠️  ${path.basename(inputPath)}`);
      console.log(`   ${originalKB}KB → ${compressedKB}KB (${reduction}% smaller)`);
      console.log(`   ❌ WebP is larger! Keeping original JPG.`);
      stats.compressedSize += originalStats.size; // Count original size
    } else {
      // WebP is smaller, keep it
      stats.compressedSize += compressedStats.size;
      console.log(`✅ ${path.basename(inputPath)}`);
      console.log(`   ${originalKB}KB → ${compressedKB}KB (${reduction}% smaller)`);
      
      // Optionally delete original
      if (!CONFIG.preserveOriginals) {
        fs.unlinkSync(inputPath);
        console.log(`   🗑️  Deleted original`);
      }
    }

    stats.processed++;
  } catch (error) {
    console.error(`❌ Failed: ${path.basename(inputPath)}`);
    console.error(`   Error: ${error.message}`);
    stats.failed++;
  }
}

/**
 * Main compression function
 */
async function compressAllImages() {
  console.log('🖼️  Image Compression Script\n');
  console.log(`📁 Input directory: ${CONFIG.inputDir}`);
  console.log(`🎨 Quality: ${CONFIG.quality}%`);
  console.log(`💾 Preserve originals: ${CONFIG.preserveOriginals ? 'Yes' : 'No'}\n`);

  // Get all image files
  const imageFiles = getAllImageFiles(CONFIG.inputDir);
  console.log(`📊 Found ${imageFiles.length} images to process\n`);

  if (imageFiles.length === 0) {
    console.log('No images found to compress.');
    return;
  }

  // Process each image
  for (const imagePath of imageFiles) {
    await compressImage(imagePath);
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Compression Summary');
  console.log('='.repeat(50));
  console.log(`✅ Processed: ${stats.processed}`);
  console.log(`❌ Failed: ${stats.failed}`);
  console.log(`📦 Original size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📦 Compressed size: ${(stats.compressedSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (stats.originalSize > 0) {
    const totalReduction = ((1 - stats.compressedSize / stats.originalSize) * 100).toFixed(1);
    const savedMB = ((stats.originalSize - stats.compressedSize) / 1024 / 1024).toFixed(2);
    console.log(`💾 Total reduction: ${totalReduction}% (saved ${savedMB} MB)`);
  }
  
  console.log('='.repeat(50));

  if (CONFIG.preserveOriginals) {
    console.log('\n💡 Tip: Original files are preserved. Delete them manually if not needed.');
  }

  console.log('\n✨ Done! Now update your code to use .webp extensions.');
}

// Run the script
compressAllImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
