// Utility functions for client-side avatar image processing (crop & compress)
// Keeps implementation lightweight without external dependencies.
export async function processAvatarImage(file: File): Promise<File> {
  // Basic upfront guard: only operate on images
  if (!file.type.startsWith('image/')) return file

  // Read file as data URL
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  }).catch(() => '')

  if (!dataUrl) return file

  // Create image element
  const img: HTMLImageElement = await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load image'))
    image.src = dataUrl
    // Fallback: if load takes >2s, use original file
    setTimeout(() => reject(new Error('Image load timeout')), 2000)
  }).catch(() => null as any)

  if (!img || !img.width || !img.height) return file

  // Determine square crop (center)
  const side = Math.min(img.width, img.height)
  const sx = (img.width - side) / 2
  const sy = (img.height - side) / 2

  // Target size: reduce large images to 256px square to save bandwidth
  const TARGET = side > 256 ? 256 : side
  const canvas = document.createElement('canvas')
  canvas.width = TARGET
  canvas.height = TARGET
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(img, sx, sy, side, side, 0, 0, TARGET, TARGET)

  // Prefer JPEG compression unless original is PNG with transparency
  const hasTransparency = detectTransparency(ctx)
  const outType = !hasTransparency ? 'image/jpeg' : 'image/png'
  const quality = outType === 'image/jpeg' ? 0.85 : undefined

  const blob: Blob | null = await new Promise(resolve => {
    canvas.toBlob(b => resolve(b), outType, quality)
  })
  if (!blob) return file

  // Preserve original extension where practical, else use .jpg/.png
  const newName = file.name.replace(/\.(png|jpg|jpeg|webp|gif)$/i, '') + (outType === 'image/jpeg' ? '.jpg' : '.png')
  return new File([blob], newName, { type: outType })
}

function detectTransparency(ctx: CanvasRenderingContext2D): boolean {
  try {
    const data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) return true
    }
  } catch (_e) {
    return false
  }
  return false
}
