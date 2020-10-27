import Get from '../utils/objects/get'
import { ComponentElement } from './component'
import RemoveElementEvents from './remove-element-events'
import ArrayFrom from '../utils/conversion/array-from'

const components: { [key: string]: { tag: string, create: (host: any) => any } } = {}
let initialized = false

function handleAddedNode(node?: ComponentElement | HTMLElement) {
    if (!node) { return }

    const tag = Get(node, 'nodeName.toLowerCase()')

    if (tag === '#text') { return }

    if (tag && components[tag]) {
        components[tag].create(node)
    }

    ArrayFrom(node.children).forEach(child => handleAddedNode(child as HTMLElement))
}

function handleRemovedNode(node: ComponentElement | HTMLElement) {
    if (!node) { return }

    if (node.children) {
        ArrayFrom(node.children).forEach(child => handleRemovedNode(child as HTMLElement))
    }

    RemoveElementEvents(node)

    const tag = Get(node, 'nodeName.toLowerCase()')
    const onDisconnected = Get(node, 'onDisconnected')

    if (tag && components[tag] && typeof onDisconnected === 'function') {
        onDisconnected(node)
    }
}

function handleChildMutation(mutation: MutationRecord) {
    if (mutation.type !== 'childList') { return }
    ArrayFrom(mutation.removedNodes).forEach(node => handleRemovedNode(node as HTMLElement))
    ArrayFrom(mutation.addedNodes).forEach(node => handleAddedNode(node as HTMLElement))
}

const ComponentObjects = {
    get: function (name: string) {
        if (name) { return components[name] }
        return components
    },

    addComponent: (tag: string, componentFunction: Function) => {
        if (!initialized) {
            initialized = true
            ComponentObjects.init()
        }

        components[tag] = {
            tag,
            create: (node: ComponentElement) => componentFunction(node) ? node.onConnected(node) : undefined
        }

        ArrayFrom(document.body.querySelectorAll(tag))
            .forEach(components[tag].create)
    },

    init: () => new MutationObserver(mutations => ArrayFrom(mutations).forEach(handleChildMutation))
        .observe(document.body, {
            childList: true,
            subtree: true
        })
}

export default ComponentObjects