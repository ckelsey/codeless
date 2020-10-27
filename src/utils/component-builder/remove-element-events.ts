import Get from "../objects/get"
import { ComponentElement } from "./component"
import Remove from '../objects/remove'

export default function RemoveElementEvents(el: ComponentElement | HTMLElement) {
    const events = Get(el, 'events', {})
    const nodeObserver = Get(el, 'nodeObserver')

    if (!el) { return }

    for (let eventKey in events) {
        if (typeof events[eventKey] === 'function') {
            events[eventKey]()
            Remove(el, `events.${eventKey}`)
        }
    }

    if (nodeObserver) {
        nodeObserver.disconnect()
    }

    return Remove(el, 'events')
}