import SetValid from './set-valid'
import ToArray from './to-array'

export default function ToMap(fn, value) {
    function ToMapFn(array) {
        const isArray = Array.isArray(array)
        return SetValid(!isArray ? array : array.map(fn), isArray)
    }

    function ToMapPartial(v) {
        return ToMapFn(ToArray(v))
    }

    if (arguments.length === 1) {
        return ToMapPartial
    }

    return ToMapPartial(value)
}