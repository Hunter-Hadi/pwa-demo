import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sizes = [192, 512];
const iconColor = '#4f46e5'; // Indigo 600
const outputDir = path.resolve('public');

// Create a simple SVG buffer
const svgBuffer = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="${iconColor}" rx="128" ry="128"/>
  <path d="M156 256 L236 336 L356 176" stroke="white" stroke-width="64" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`);

async function generateIcons() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const size of sizes) {
    const filename = `pwa-${size}x${size}.png`;
    const outputPath = path.join(outputDir, filename);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
      
    console.log(`Generated ${filename}`);
  }
  
  // Generate apple-touch-icon (usually 180x180, but using 192 for simplicity or resize)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');

  // Generate favicon.png (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFormat('png')
    .toFile(path.join(outputDir, 'favicon.ico')); // Vite can handle png as ico mostly, but let's just save as png and rename or use png
    console.log('Generated favicon.ico (as png)');

   // Generate mask-icon.svg (simple copy or create)
   fs.writeFileSync(path.join(outputDir, 'mask-icon.svg'), `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <path d="M156 256 L236 336 L356 176" stroke="black" stroke-width="64" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
   `.trim());
   console.log('Generated mask-icon.svg');
}

generateIcons().catch(console.error);
