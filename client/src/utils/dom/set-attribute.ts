export default function SetAttribute(el: HTMLElement, key: string, value: any) {
    if (!el) { return el }

    if (value === undefined || value === null) {
        el.removeAttribute(key)
    } else {
        el.setAttribute(key, value.toString())
    }


    return el
}