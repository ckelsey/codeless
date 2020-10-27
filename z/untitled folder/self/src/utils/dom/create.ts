import Set from '../objects/set'

export interface CreateOptions {
    tag: string
    properties?: { [key: string]: any }
    evaluatedProperties?: { [key: string]: Function }
    attributes?: { [key: string]: string }
    events: { [key: string]: (event: Event) => void }
}

export default function Create({ tag = '', properties = {}, evaluatedProperties = {}, attributes = {} }: CreateOptions) {
    if (!tag) { return }

    const el = document.createElement(tag)

    Object.keys(properties).forEach(key => Set(el, key, properties[key]))
    Object.keys(evaluatedProperties).forEach(key => Set(el, key, evaluatedProperties[key]()))
    Object.keys(attributes).forEach(key => el.setAttribute(key, attributes[key]))

    return el
}