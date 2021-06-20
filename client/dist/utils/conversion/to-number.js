import SetValid from './set-valid.js';
export default function ToNumber(value) {
    const result = Number(value);
    const isNumber = !isNaN(result);
    return SetValid(isNumber ? result : value, isNumber);
}
