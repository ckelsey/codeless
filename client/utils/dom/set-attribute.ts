export default function SetAttribute(el: HTMLElement, key: string, value: any) {
    if (!el) { return el }

    el.setAttribute(key, value)

    return el
}