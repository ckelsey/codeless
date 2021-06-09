import Pipe from '../function-helpers/pipe';
import ToPlainText from './to-plain-text';
import FromJSON from './from-json';
import SetValid from './set-valid';
import Try from '../try';
import ArrayFrom from './array-from';
export default function ToArray(value) {
  if (!value) {
    return SetValid(value, false);
  }
  if (Array.isArray(value)) {
    return SetValid(value, true);
  }
  const json = Pipe(ToPlainText, FromJSON)(value);
  if (Array.isArray(json)) {
    return SetValid(json, true);
  }
  return Try(() => {
    const array = ArrayFrom(value);
    SetValid(array, Array.isArray(array));
  }) || SetValid(value, false);
}
