import Try from '../try';
import SetValid from './set-valid';
export default function FromJSON(value) {
  return Try(() => SetValid(JSON.parse(value), true)) || SetValid(value, false);
}
