export default function ArrayFrom(elements: any) {
    const result = []

    if (elements && elements.length) {
        const length = elements.length
        let index = 0

        while (index < length) {
            result.push(elements[index])
            index = index + 1
        }
    }

    return result
}