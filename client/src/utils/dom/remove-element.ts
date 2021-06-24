import ArrayFrom from '../conversion/array-from'
import Get from "../objects/get";
import Try from '../try';

export default function RemoveElement(el: HTMLElement | Element | undefined) {
    if (!el) { return el }

    Try(() => (el as any).style.display = 'none')

    ArrayFrom(el.children || []).forEach(RemoveElement)

    Get(el, 'events.dispose()')

    if (el.parentElement) {
        el.parentElement.removeChild(el)
    }
}