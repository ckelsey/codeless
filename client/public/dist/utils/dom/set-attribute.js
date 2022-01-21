export default function SetAttribute(el, key, value) {
    if (!el || (el && typeof el.removeAttribute !== 'function')) {
        return el;
    }
    const current = el.getAttribute(key);
    if ((value === undefined || value === null) && current !== value) {
        el.removeAttribute(key);
    }
    else if (current !== value) {
        el.setAttribute(key, value.toString());
    }
    return el;
}
