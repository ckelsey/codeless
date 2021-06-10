import Pipe from '../function-helpers/pipe';
import SetValid from './set-valid';
import Try from '../try';
function respond(value) {
  return SetValid(value, Array.isArray(value));
}
function CommasToArraySplit(value) {
  return Try(() => value.split(',').map((v) => v.trim())) || value;
}
export default function CommasToArray(value) {
  return Array.isArray(value) ? SetValid(value, true) : Pipe(CommasToArraySplit, respond)(value);
}
