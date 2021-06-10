export default function Partial(fn: Function, args: any[]) {

    if (!fn || typeof fn !== 'function') {
        throw new Error('First parameter must be a function')
    }

    const arity = (fn as any).arity || fn.length

    const argArray = Array.isArray(args) ? args : [args]
    const result = function () {
        return Partial.apply(null, [fn, [...argArray, ...Array.from(arguments)]])
    }

    result.arity = arity - argArray.length

    Object.defineProperties(result, {
        push: {
            value: function (arg: any) {
                return Partial(fn, [...argArray, arg])
            }
        },
        pop: {
            value: function () {
                return Partial(fn, argArray.slice(0, argArray.length - 1))
            }
        },
        unshift: {
            value: function (arg: any) {
                return Partial(fn, [arg, ...argArray])
            }
        },
        shift: {
            value: function () {
                return Partial(fn, argArray.slice(1))
            }
        },
        concat: {
            value: function () {
                return Partial(fn, [...argArray, ...arguments])
            }
        },
        do: {
            value: function () {
                return fn.apply(fn, [...argArray, ...arguments])
            }
        },
        currentArgs: {
            get() { return argArray }
        }
    })

    if (result.arity <= 0) {
        return fn.apply(fn, argArray)
    }

    return result



    // arity = arity || fn.length || args.length + 1
    // const argArray = Array.isArray(args) ? args : args ? [args] : []

    // /** If no function passed in, return */
    // if (!fn) { return }

    // /** If the passed in arguments equal the original functions arity, just call the function */
    // if (argArray.length >= arity) {
    //     return fn.apply(null, argArray)
    // }

    // /** return function that takes new arguments which then returns a new FunctionToPartial */
    // return () => Partial.apply(null, [fn, [...argArray, ...Array.from(arguments)], arity])
}