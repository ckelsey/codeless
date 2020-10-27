import GetEase from './get-ease'

export default function EaseIn(values, duration, pow) {
    pow = pow === undefined ? 4 : pow

    function fn(index, frames) {
        const t = index / frames
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    return GetEase(values, duration, pow, fn)
}