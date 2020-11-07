import SetValid from './set-valid'
import ToArray from './to-array'

export default function ToFilter(fn: Function, value?: any) {
    function ToFilterFn(array: any) {
        const isArray = Array.isArray(array)
        return SetValid(!isArray ? array : array.filter(fn), isArray)
    }

    function ToFilterPartial(v: any) {
        return ToFilterFn(ToArray(v))
    }

    if (arguments.length === 1) {
        return ToFilterPartial
    }

    return ToFilterPartial(ToArray(value))
}