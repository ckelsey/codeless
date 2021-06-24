import { ComponentElement } from "../../component-builder/component";
import RemoveElementEvents from "../../component-builder/remove-element-events";
import ArrayFrom from '../conversion/array-from'

export default function RemoveElement(el: ComponentElement | Element) {
    if (!el) { return el }

    ArrayFrom(el.children || []).forEach(RemoveElement)

    RemoveElementEvents(el)

    if (el.parentElement) {
        el.parentElement.removeChild(el)
    }
}