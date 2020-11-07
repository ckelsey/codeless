export default function UntilTrue(checker: Function, fns: any[]) {
    let value: any
    let index = 0
    const length = fns.length


    while (index < length) {
        value = fns[index]

        if (typeof value == 'function') {
            value = value()
        }

        const result = checker(value)

        if (result) {
            return value
        }

        index = index + 1
    }
}