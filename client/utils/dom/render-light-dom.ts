const RenderLightDom = (host: HTMLElement, selector: string, attributes) => {
    let element = host.querySelector(selector)
    const exists = !!element

    if (!exists) { element = host.ownerDocument.createElement(attributes.tagName) }

    Object.keys(attributes).forEach((key: string) => {
        if (key === 'tagName' || !key) { return }

        if (['class'].indexOf(key) > -1) {
            return element.setAttribute(key, attributes[key])
        }

        element[key] = attributes[key]
    })

    if (!exists) { host.appendChild(element) }

    return element
}

export default RenderLightDom