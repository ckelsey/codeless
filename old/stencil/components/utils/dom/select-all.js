import ArrayFrom from '../conversion/array-from';
import Get from '../objects/get';
export default function SelectAll(selector, root = document.body) {
  return ArrayFrom(Get(root, `querySelectorAll(${selector})`));
}
