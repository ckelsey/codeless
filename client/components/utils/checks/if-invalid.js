import SetValid, { IsValid } from '../conversion/set-valid';
export default function IfInvalid(replacement, value) {
  function IfInvalidPartial(v) {
    const doReplacement = !IsValid(v);
    if (typeof replacement == 'function') {
      return SetValid(doReplacement ? replacement() : v, true);
    }
    return SetValid(doReplacement ? replacement : v, true);
  }
  if (arguments.length === 1) {
    return IfInvalidPartial;
  }
  return IfInvalidPartial(value);
}
