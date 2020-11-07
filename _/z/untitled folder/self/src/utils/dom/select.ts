import ArrayFrom from '../conversion/array-from'
import Get from '../objects/get'

export default function Select(selector: string, root = document.body) {
    return Get(root, `querySelectorAll(${selector})`)
}