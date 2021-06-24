import ArrayFrom from '../conversion/array-from'
import Get from '../objects/get'

export default function SelectAll(selector: string, root = document.body): Element[] {
    return ArrayFrom(Get(root, `querySelectorAll(${selector})`))
}