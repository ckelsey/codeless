import { ComponentElement } from '../../component-builder/component'

export default function DispatchEvent(element: ComponentElement | Element, name: string, data?: any) {
    let event

    if (typeof (Event) === 'function') {
        event = new CustomEvent(name, { detail: data })
    } else {
        event = document.createEvent('Event')
        event.initEvent(name, true, true)
    }

    element.dispatchEvent(event)

    return element
}