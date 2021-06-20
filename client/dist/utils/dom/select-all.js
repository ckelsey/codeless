import ArrayFrom from '../conversion/array-from.js';
import Get from '../objects/get.js';
export default function SelectAll(selector, root = document.body) {
    return ArrayFrom(Get(root, `querySelectorAll(${selector})`));
}
