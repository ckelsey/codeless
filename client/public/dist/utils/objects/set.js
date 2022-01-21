export default function Set(source, path, value) {
    const paths = path ? path.split('.') : [];
    paths.reduce(function (accumulator, currentValue) {
        if (!accumulator) {
            accumulator = {};
        }
        if (!accumulator[currentValue]) {
            accumulator[currentValue] = {};
        }
        if (currentValue) {
            if (currentValue === paths[paths.length - 1]) {
                accumulator[currentValue] = value;
            }
            return accumulator[currentValue];
        }
        else {
            accumulator[currentValue] = null;
            return accumulator;
        }
    }, source);
    return source;
}
