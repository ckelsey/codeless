export default function SetAttribute(el, key, value) {
    if (!el) {
        return el;
    }
    if (value === undefined || value === null) {
        el.removeAttribute(key);
    }
    else {
        el.setAttribute(key, value.toString());
    }
    return el;
}
