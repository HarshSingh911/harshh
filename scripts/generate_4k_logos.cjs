const cp = require('child_process');
const fs = require('fs');

// 1. Generate base clean transparent image with ImageMagick
cp.execSync('convert public/assets/aistudio/logo_06499381.jpeg -fuzz 10% -transparent white -trim +repage /tmp/base_clean.png');

// Get dimensions
const info = cp.execSync('identify -format "%w %h" /tmp/base_clean.png').toString().trim().split(' ');
const width = parseInt(info[0], 10);
const height = parseInt(info[1], 10);
console.log('Base dimensions:', width, height);

// Dump RGBA
cp.execSync('convert /tmp/base_clean.png /tmp/base_clean.rgba');
const src = fs.readFileSync('/tmp/base_clean.rgba');

const whiteBuf = Buffer.alloc(src.length);
const navyBuf = Buffer.alloc(src.length);

// Copy source directly to navyBuf (it is already the exact original navy logo with clean transparent background!)
src.copy(navyBuf);

// For whiteBuf: replace the navy color with pure crisp white
for (let i = 0; i < src.length; i += 4) {
  const r = src[i];
  const g = src[i+1];
  const b = src[i+2];
  const a = src[i+3];

  if (a < 10) {
    whiteBuf[i] = 0; whiteBuf[i+1] = 0; whiteBuf[i+2] = 0; whiteBuf[i+3] = 0;
    continue;
  }

  // Cyan detector: Cyan in the original image has (b - r) > 60 && (g - r) > 45
  const isCyan = (b - r > 60 && g - r > 45);

  if (isCyan) {
    // Keep cyan
    whiteBuf[i] = r;
    whiteBuf[i+1] = g;
    whiteBuf[i+2] = b;
    whiteBuf[i+3] = a;
  } else {
    // Navy / dark pixel -> transform to Pure White
    whiteBuf[i] = 255;
    whiteBuf[i+1] = 255;
    whiteBuf[i+2] = 255;
    whiteBuf[i+3] = a;
  }
}

fs.writeFileSync('/tmp/white_clean.rgba', whiteBuf);
cp.execSync(`convert -size ${width}x${height} -depth 8 /tmp/white_clean.rgba /tmp/white_clean.png`);

// Save high-resolution 4K versions
cp.execSync('cp /tmp/base_clean.png public/assets/images/tripyehh_navy_4k.png');
cp.execSync('cp /tmp/white_clean.png public/assets/images/tripyehh_white_4k.png');
cp.execSync('cp public/assets/images/tripyehh_navy_4k.png public/assets/images/tripyehh_dark_navy.png');
cp.execSync('cp public/assets/images/tripyehh_white_4k.png public/assets/images/tripyehh_white_text.png');
cp.execSync('cp -r public/assets/images/tripyehh* src/assets/images/ 2>/dev/null || true');

console.log('Successfully produced pristine 4K transparent logos with true font weight!');
