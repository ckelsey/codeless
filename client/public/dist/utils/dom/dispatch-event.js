export default function DispatchEvent(element, name, data) {
    let event;
    if (typeof (Event) === 'function') {
        event = new CustomEvent(name, { detail: data });
    }
    else {
        event = document.createEvent('Event');
        event.initEvent(name, true, true);
    }
    element.dispatchEvent(event);
    return element;
}
