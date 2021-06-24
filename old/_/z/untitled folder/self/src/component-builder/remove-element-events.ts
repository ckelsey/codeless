import Get from "../utils/objects/get"
import { ComponentElement } from "./component"
import Remove from '../utils/objects/remove'

export default function RemoveElementEvents(el: ComponentElement | Element) {
    const events = Get(el, 'events')

    if (!el || !events) { return }

    for (let eventKey in events) {
        if (typeof events[eventKey] === 'function') {
            events[eventKey]()
            Remove(el, `events.${eventKey}`)
        }
    }

    return Remove(el, 'events')
}