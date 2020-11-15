export default function ElementEvents(element) {
    if (!element) { return {} }

    const events: { [key: string]: () => void } = {}

    const clearEvent = (key: string) => {
        if (events[key] && typeof events[key] === 'function') { events[key]() }
        delete events[key]
    }

    return {
        add: (eventName: string, callback: any) => {
            clearEvent(eventName)
            element.addEventListener(eventName, callback, true)
            events[eventName] = () => element.removeEventListener(eventName, callback)
        },
        remove: clearEvent,
        dispose: () => Object.keys(events).forEach(clearEvent),
        events
    }
}