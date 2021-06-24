import SetValid from './set-valid';
import Try from '../try';
export default function ToString(value) {
  function ToStringInternal(str) {
    return SetValid(str, typeof str == 'string');
  }
  return ToStringInternal(Try(() => value.toString()));
}
