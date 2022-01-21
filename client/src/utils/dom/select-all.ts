import ArrayFrom from '../conversion/array-from'

export default function SelectAll(selector: string, root = document.body): Element[] {
    return ArrayFrom(root.querySelectorAll(selector))
}