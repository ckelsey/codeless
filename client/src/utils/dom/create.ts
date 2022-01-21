/**
 * TODO
 * look into https://developers.google.com/web/updates/2015/08/using-requestidlecallback in regards to using document fragment
 */
import Set from '../objects/set'

export interface CreateOptions {
    tag: string
    properties?: { [key: string]: any }
    evaluatedProperties?: { [key: string]: Function }
    attributes?: { [key: string]: string }
    events?: { [key: string]: (event: Event) => void }
    subscriptions?: { [key: string]: Function },
    children?: HTMLElement[]
}

export default function Create({ tag = '', properties = {}, evaluatedProperties = {}, attributes = {}, subscriptions = {}, children = [] }: CreateOptions) {
    if (!tag) { return }

    const el = document.createElement(tag)

    Set(el, 'subscriptions', {})

    Object.keys(properties).forEach(key => Set(el, key, properties[key]))
    Object.keys(evaluatedProperties).forEach(key => Set(el, key, evaluatedProperties[key]()))
    Object.keys(attributes).forEach(key => el.setAttribute(key, attributes[key]))
    Object.keys(subscriptions).forEach(key => Set(el, `subscriptions.${key}`, subscriptions[key](el)))

    children.forEach(child => el.appendChild(child))

    return el
}