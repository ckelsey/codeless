import RemoveElementEvents from "../../utils/component-builder/remove-element-events";
import ArrayFrom from '../conversion/array-from'

export default function RemoveElement(el: HTMLElement) {
    if (!el) { return el }

    el.style.display = 'none'

    ArrayFrom(el.children || []).forEach(RemoveElement)

    RemoveElementEvents(el)

    if (el.parentElement) {
        el.parentElement.removeChild(el)
    }
}