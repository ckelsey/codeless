import SetValid from "./set-valid";
import IsObject from "../types/is-object";
import Try from "../try";
export default function ToOptions(value, keyMap = { textContent: 'textContent', value: 'value' }) {
  if (!Array.isArray(value)) {
    return SetValid(value, false);
  }
  const result = value
    .map((currentValue) => {
    if (typeof currentValue == 'string') {
      return { textContent: currentValue, value: currentValue };
    }
    if (IsObject(currentValue)) {
      const parsed = {};
      Object.keys(currentValue).forEach((key) => Try(parsed[keyMap[key] || key] = currentValue[key].toString()));
      return parsed;
    }
  })
    .filter((currentObject) => !!currentObject);
  return SetValid(result, true);
}
