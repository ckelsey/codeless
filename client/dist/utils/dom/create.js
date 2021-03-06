import Set from "../objects/set.js";
export default function Create({ tag = '', properties = {}, evaluatedProperties = {}, attributes = {}, subscriptions = {}, children = [] }) {
    if (!tag) {
        return;
    }
    const el = document.createElement(tag);
    Set(el, 'subscriptions', {});
    Object.keys(properties).forEach(key => Set(el, key, properties[key]));
    Object.keys(evaluatedProperties).forEach(key => Set(el, key, evaluatedProperties[key]()));
    Object.keys(attributes).forEach(key => el.setAttribute(key, attributes[key]));
    Object.keys(subscriptions).forEach(key => Set(el, `subscriptions.${key}`, subscriptions[key](el)));
    children.forEach(child => el.appendChild(child));
    return el;
}
