import DispatchEvent from '../dom/dispatch-event'
import Set from '../objects/set'

export default function UpdateLabelUp(
    input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    host: HTMLElement,
    justSetAttr: boolean = false
) {
    return function UpdateLabelUpInner(e?: Event) {
        if (document.activeElement === input || input.value !== '') {
            input.setAttribute('label-up', 'true')
        } else {
            input.removeAttribute('label-up')
        }

        if (!e || justSetAttr) { return }

        if (e.type === 'focusin') {
            DispatchEvent(host, 'focus', host)
        }

        if (e.type === 'focusout') {
            DispatchEvent(host, 'blur', host)
        }

        if (e.type === 'input') {
            Set(host, 'value', input.value)
        }
    }
}