import EasePower from './ease-power';
import GetEase from './get-ease';
export default function EaseInOut(values, duration, pow = 4) {
  function fn(index, frames, pow) {
    return EasePower((index / frames) * (index / frames), pow);
  }
  return GetEase(values, duration, pow, fn);
}
