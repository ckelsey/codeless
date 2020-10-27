import Set from '../objects/set'

export interface CreateOptions {
    tag: string
    properties?: { [key: string]: any }
    evaluatedProperties?: { [key: string]: Function }
    attributes?: { [key: string]: string }
    events?: { [key: string]: (event: Event) => void }
    subscriptions?: { [key: string]: Function }
}

export default function Create({ tag = '', properties = {}, evaluatedProperties = {}, attributes = {}, subscriptions = {} }: CreateOptions) {
    if (!tag) { return }

    const el = document.createElement(tag)

    Set(el, 'subscriptions', {})

    Object.keys(properties).forEach(key => Set(el, key, properties[key]))
    Object.keys(evaluatedProperties).forEach(key => Set(el, key, evaluatedProperties[key]()))
    Object.keys(attributes).forEach(key => el.setAttribute(key, attributes[key]))
    Object.keys(subscriptions).forEach(key => Set(el, `subscriptions.${key}`, subscriptions[key](el)))

    return el
}