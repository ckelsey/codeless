import Get from '../objects/get'
import RemoveElementEvents from './remove-element-events'
import ArrayFrom from '../conversion/array-from'
import { ComponentArguments } from './component'
import DOMReady from '../dom/ready'

// const components: { [key: string]: { settings: ComponentArguments, create: (host: any) => any } } = {}
const components = new WeakMap()
// const componentKeys: { [key: string]: { tag: string } } = {}
const componentKeys = new Map()
let initialized = false

function handleAddedNode(node?: any) {
    if (!node) { return }

    const tag = Get(node, 'nodeName.toLowerCase()')

    if (tag === '#text') { return }

    if (tag && components.get(componentKeys.get(tag))) {
        components.get(componentKeys.get(tag)).create(node)
    }

    ArrayFrom(node.children).forEach(child => handleAddedNode(child))
}

function handleRemovedNode(node: any) {
    if (!node) { return }

    if (node.children) {
        ArrayFrom(node.children).forEach(child => handleRemovedNode(child))
    }

    RemoveElementEvents(node)

    const tag = Get(node, 'nodeName.toLowerCase()')
    const onDisconnected = Get(node, 'onDisconnected')
    const component = components.get(componentKeys.get(tag))

    if (component && typeof onDisconnected === 'function') {
        onDisconnected(node)
    }
}

function handleChildMutation(mutation: MutationRecord) {
    if (mutation.type !== 'childList') { return }
    ArrayFrom(mutation.removedNodes).forEach(node => handleRemovedNode(node))
    ArrayFrom(mutation.addedNodes).forEach(node => handleAddedNode(node))
}

function init() {
    initialized = true

    return new Promise(resolve => {
        DOMReady().then(() => {
            new MutationObserver(mutations => ArrayFrom(mutations).forEach(handleChildMutation))
                .observe(document.body, {
                    childList: true,
                    subtree: true
                })

            resolve()
        })
    })
}

function continueAddComponent() {
    return DOMReady()
}

const ComponentObjects = {
    add: (settings: ComponentArguments, componentFunction: Function) =>
        (!initialized ? init() : continueAddComponent())
            .then(() => {
                componentKeys.set(settings.tag, { tag: settings.tag })
                components.set(componentKeys.get(settings.tag), {
                    settings,
                    create: (node: any) => componentFunction(node) ? node.onConnected(node) : undefined
                })

                ArrayFrom(document.body.querySelectorAll(settings.tag)).forEach(() => components.get(componentKeys.get(settings.tag)).create)
            })

    // if (!initialized) {

    //     ComponentObjects.init()
    // }

    // components[settings.tag] = {
    //     settings,
    //     create: (node: any) => componentFunction(node) ? node.onConnected(node) : undefined
    // }

    // DOMReady().then(() =>
    //     ArrayFrom(document.body.querySelectorAll(settings.tag))
    //         // .forEach(components[settings.tag].create)
    // )

    // ,

    // init: () => DOMReady().then(() =>
    //     new MutationObserver(mutations => ArrayFrom(mutations).forEach(handleChildMutation))
    //         .observe(document.body, {
    //             childList: true,
    //             subtree: true
    //         })
    // )
}

export default ComponentObjects