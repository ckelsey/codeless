/** SOURCE: https://medium.com/@bantic/hand-coding-a-color-wheel-with-canvas-78256c9d7d43 */
function rad2deg(rad) { return ((rad + Math.PI) / (2 * Math.PI)) * 360 }

function xy2polar(x, y) { return [Math.sqrt(x * x + y * y), Math.atan2(y, x)] }

function hsv2rgb(hue, saturation, value) {
    const chroma = (value * 1.5) * saturation
    const hue1 = hue / 60
    const x = chroma * (1 - Math.abs((hue1 % 2) - 1))
    let r1, g1, b1
    if (hue1 >= 0 && hue1 <= 1) {
        ([r1, g1, b1] = [chroma, x, 0])
    } else if (hue1 >= 1 && hue1 <= 2) {
        ([r1, g1, b1] = [x, chroma, 0])
    } else if (hue1 >= 2 && hue1 <= 3) {
        ([r1, g1, b1] = [0, chroma, x])
    } else if (hue1 >= 3 && hue1 <= 4) {
        ([r1, g1, b1] = [0, x, chroma])
    } else if (hue1 >= 4 && hue1 <= 5) {
        ([r1, g1, b1] = [x, 0, chroma])
    } else if (hue1 >= 5 && hue1 <= 6) {
        ([r1, g1, b1] = [chroma, 0, x])
    }

    const m = value - chroma
    const [r, g, b] = [r1 + m, g1 + m, b1 + m]

    // Change r,g,b values from [0,1] to [0,255]
    return [255 * r, 255 * g, 255 * b]
}

export default function DrawWheel(ctx) {
    const radius = 500
    const image = ctx.createImageData(2 * radius, 2 * radius)
    const data = image.data

    for (let x = -radius; x < radius; x++) {
        for (let y = -radius; y < radius; y++) {

            let [r, phi] = xy2polar(x, y)

            // skip all (x,y) coordinates that are outside of the circle
            if (r > radius) { continue }

            const deg = rad2deg(phi)

            // Figure out the starting index of this pixel in the image data array.
            const rowLength = 2 * radius
            const adjustedX = x + radius // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
            const adjustedY = y + radius // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
            const pixelWidth = 4 // each pixel requires 4 slots in the data array
            const index = (adjustedX + (adjustedY * rowLength)) * pixelWidth

            const hue = deg
            const saturation = r / radius
            const value = 1.0

            const [red, green, blue] = hsv2rgb(hue, saturation, value)
            const alpha = 255

            data[index] = red
            data[index + 1] = green
            data[index + 2] = blue
            data[index + 3] = alpha
        }
    }

    ctx.putImageData(image, 0, 0)
}