export default function Pipe(..._args) {
    const functions = arguments;
    const count = functions.length;
    return function PipeInnerFunction(value) {
        let loopIndex = count + 1;
        while (loopIndex--) {
            value = typeof functions[count - loopIndex] !== 'function' ?
                value :
                functions[count - loopIndex](value);
        }
        return value;
    };
}
