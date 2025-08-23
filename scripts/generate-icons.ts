import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import png2icons from 'png2icons'

const inputIcon = path.join(__dirname, '..', 'icon.png')
const outputDir = path.join(__dirname, '..', 'build-resources')

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// macOS icon sizes (.icns format requires these sizes)
const macSizes: number[] = [16, 32, 64, 128, 256, 512, 1024]

// Windows icon sizes (.ico format supports these sizes)
const winSizes: number[] = [16, 24, 32, 48, 64, 128, 256]

async function generateIcons(): Promise<void> {
  console.log('Generating icons...')

  // Generate all sizes in all formats
  const allSizes: number[] = [...new Set([...macSizes, ...winSizes])]

  for (const size of allSizes) {
    const buffer = await sharp(inputIcon)
      .resize(size, size)
      .png()
      .toBuffer()
    
    // Save individual PNG files
    await fs.promises.writeFile(path.join(outputDir, `icon-${size}.png`), buffer)
    console.log(`Generated ${size}x${size} PNG`)
    
    // Generate individual .icns files for each size
    try {
      const icnsBuffer = png2icons.createICNS(buffer, png2icons.BILINEAR, 0)
      if (icnsBuffer) {
        await fs.promises.writeFile(path.join(outputDir, `icon-${size}.icns`), icnsBuffer)
        console.log(`Generated ${size}x${size} ICNS`)
      } else {
        console.warn(`Failed to generate ${size}x${size} .icns file: buffer is null`)
      }
    } catch (error) {
      console.warn(`Failed to generate ${size}x${size} .icns file:`, error)
    }
    
    // Generate individual .ico files for each size
    try {
      const icoBuffer = png2icons.createICO(buffer, png2icons.BILINEAR, 0, false)
      if (icoBuffer) {
        await fs.promises.writeFile(path.join(outputDir, `icon-${size}.ico`), icoBuffer)
        console.log(`Generated ${size}x${size} ICO`)
      } else {
        console.warn(`Failed to generate ${size}x${size} .ico file: buffer is null`)
      }
    } catch (error) {
      console.warn(`Failed to generate ${size}x${size} .ico file:`, error)
    }
  }

  // Copy original as icon.png
  const originalBuffer = await sharp(inputIcon).png().toBuffer()
  await fs.promises.writeFile(path.join(outputDir, 'icon.png'), originalBuffer)

  // Generate consolidated .icns file for macOS
  try {
    const icnsBuffer = png2icons.createICNS(originalBuffer, png2icons.BILINEAR, 0)
    if (icnsBuffer) {
      await fs.promises.writeFile(path.join(outputDir, 'icon.icns'), icnsBuffer)
      console.log('Generated consolidated icon.icns for macOS')
    } else {
      console.warn('Failed to generate consolidated .icns file: buffer is null')
    }
  } catch (error) {
    console.warn('Failed to generate consolidated .icns file:', error)
  }

  // Generate consolidated .ico file for Windows
  try {
    const icoBuffer = png2icons.createICO(originalBuffer, png2icons.BILINEAR, 0, false)
    if (icoBuffer) {
      await fs.promises.writeFile(path.join(outputDir, 'icon.ico'), icoBuffer)
      console.log('Generated consolidated icon.ico for Windows')
    } else {
      console.warn('Failed to generate consolidated .ico file: buffer is null')
    }
  } catch (error) {
    console.warn('Failed to generate consolidated .ico file:', error)
  }

  console.log('Icons generated successfully!')
  console.log('Generated files in:', outputDir)
  console.log('Available formats: PNG, ICNS, ICO (all sizes + consolidated versions)')
}

generateIcons().catch(console.error)