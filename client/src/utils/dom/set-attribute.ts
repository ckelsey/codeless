/** @description If element exists, sets or removes attribute if supplied value is different than current value */
export default function SetAttribute(el: HTMLElement, key: string, value: any) {
    if (!el || (el && typeof el.removeAttribute !== 'function')) { return el }

    const current = el.getAttribute(key)

    if ((value === undefined || value === null) && current !== value) {
        el.removeAttribute(key)
    } else if (current !== value) {
        el.setAttribute(key, value.toString())
    }

    return el
}