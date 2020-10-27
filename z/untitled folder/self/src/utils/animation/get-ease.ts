function distance(v: number[]) {
    return v[1] - v[0]
}

export default function GetEase(values: number[], duration: number, pow: number, powerFn: (index: number, duration: number, pow: number) => number) {
    const results = []
    let index = 0

    while (index < duration - 1) {
        const current = Math.round((distance(values) * powerFn(index, duration, pow)) * 1000) / 1000
        results.push(values[0] + current)
        index = index + 1
    }

    results.push(values[1])

    return results
}
