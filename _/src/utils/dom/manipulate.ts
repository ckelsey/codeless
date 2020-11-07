import Get from "../objects/get"

export default function Manipulate(el: HTMLElement | Node, options = {}) {
    if (!el || (!(el instanceof HTMLElement) && !(el instanceof Node))) {
        return
    }

    const properties: { [key: string]: any } = Get(options, 'properties', {})
    const attributes: { [key: string]: any } = Get(options, 'attributes', {})

    let noDisplayStyle = !Get(el, 'style.display')

    if (noDisplayStyle) {
        (el as any).style.display = 'none'
    }

    for (const prop in properties) {
        (el as any)[prop] = properties[prop]
    }

    for (const attr in attributes) {
        (el as any).setAttribute(attr, attributes[attr])
    }

    if (noDisplayStyle) {
        (el as any).style.removeProperty('display')
    }
}