import EasePower from './ease-power'
import GetEase from './get-ease'

export default function EaseInOut(values: number[], duration: number, pow: number = 4) {
    function fn(index: number, frames: number, pow: number) {
        return EasePower((index / frames) * (index / frames), pow)
    }

    return GetEase(values, duration, pow, fn)
}