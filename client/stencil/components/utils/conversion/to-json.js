import Try from '../try';
import SetValid from './set-valid';
function ToJSONInternal(json, value) {
  return SetValid(json || value, !!json);
}
export default function ToJSON(value) {
  return ToJSONInternal(Try(() => JSON.stringify(value)), value);
}
