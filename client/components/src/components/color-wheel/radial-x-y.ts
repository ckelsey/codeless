export default function RadialXY(hue, lightness, wheelBox) {
    const outerRadius = wheelBox.width / 2
    const radius = outerRadius * ((100 - lightness) / 100)

    return {
        x: outerRadius + (radius * Math.cos(hue * Math.PI / 180)),
        y: (outerRadius * 2) - (outerRadius + -(radius * Math.sin(hue * Math.PI / 180)))
    }
}