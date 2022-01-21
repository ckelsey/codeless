export default function ArrayFrom(elements) {
    if (Array.isArray(elements)) {
        return elements.slice();
    }
    const result = [];
    if (elements && elements.length) {
        const length = elements.length;
        let index = 0;
        while (index < length) {
            result.push(elements[index]);
            index = index + 1;
        }
    }
    else if (elements) {
        result.push(elements);
    }
    return result;
}
