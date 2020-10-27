import EasePower from './ease-power'
import GetEase from './get-ease'

export default function EaseOut(values, duration, pow) {
    pow = pow === undefined ? 4 : pow

    function fn(index, frames, pow) {
        return EasePower(index / frames, pow)
    }

    return GetEase(values, duration, pow, fn)
}