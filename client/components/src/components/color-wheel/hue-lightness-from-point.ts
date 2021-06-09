export default function HueLightnessFromPoint(x, y, wheelBox) {
    const radius = wheelBox.width / 2
    const distanceX = x - (radius + (wheelBox.left + + window.scrollX))
    const distanceY = y - (radius + (wheelBox.top + window.scrollY))
    const angle = Math.atan2(distanceY, distanceX) * (180 / Math.PI)
    const degrees = angle < 0 ? angle + 360 : angle
    const absoluteX = Math.abs(distanceX)
    const absoluteY = Math.abs(distanceY)

    return {
        hue: Math.min(360, Math.max(0, degrees)),
        lightness: Math.min(100, Math.max(0, Math.round(100 - ((Math.sqrt((absoluteX * absoluteX) + (absoluteY * absoluteY)) * 100) / radius))))
    }
}