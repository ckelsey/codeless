export default function PixelFromMedia(media: HTMLVideoElement | HTMLImageElement, x: number, y: number) {
    const ctx = document.createElement('canvas').getContext('2d')

    if (!ctx) { return }

    ctx.canvas.width = media.width
    ctx.canvas.height = media.height
    ctx.drawImage(media, 0, 0, media.width, media.height)

    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data

    return { r, g, b }
}