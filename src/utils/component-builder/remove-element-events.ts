import Get from "../objects/get"
import Remove from '../objects/remove'

export default function RemoveElementEvents(el: HTMLElement) {
    if (!el || el.nodeName == '#text' || (!(el instanceof Node) && !(el as any instanceof HTMLElement))) { return }

    const events = Get(el, 'events', {})
    const nodeObserver = Get(el, 'nodeObserver')


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