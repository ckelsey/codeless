import ArrayFrom from "../conversion/array-from.js";
export default function SelectAll(selector, root = document.body) {
    return ArrayFrom(root.querySelectorAll(selector));
}
