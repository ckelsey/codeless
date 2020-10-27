import { ComponentArguments, ComponentElements, ComponentProperty, SlotObjects } from './component'
import ComponentObjects from './component-objects'
import WhenState from './when-state'
import ID from '../id'
import Equals from '../checks/equals'
import RemoveElementEvents from './remove-element-events'
import Get from '../objects/get'
import Observer, { ObserverInstance } from '../observe/observer'
import ArrayFrom from '../conversion/array-from'
import RemoveChildren from '../dom/remove-children'
import DispatchEvent from '../dom/dispatch-event'

const win = window as any
win.genesisObserver = Observer([{ src: 'dawn', time: new Date() }])
win.genesis = function (src: string) { win.genesisObserver.insert({ src, time: new Date() }) }
win.showGenesis = () => {
    console.log(
        win.genesisObserver.value,
        win.genesisObserver.value[win.genesisObserver.value.length - 1].time - win.genesisObserver.value[0].time
    )
}

interface mutaionObserverConfig {
    attributes: boolean
    attributeFilter?: string[]
    childList?: boolean
}

function emptyFn() { }

function attributeMutation(mutation: MutationRecord) {
    const target: any = mutation.target
    const attr = mutation.attributeName

    if (!target || !target.parentNode || !attr) { return }

    target[attr] = target.getAttribute(mutation.attributeName)
}

function childMutation(host: any, slotSettings: SlotObjects | undefined) {
    if (!host || !slotSettings) { return }

    ArrayFrom(host.children).forEach(el => {
        const slotKey = el.getAttribute('slot-ref')

        if (!slotSettings[slotKey]) { return }

        const target = host.querySelector(slotSettings[slotKey].target)

        if (!target) { return }

        if (!slotSettings[slotKey].multiple) {
            RemoveChildren(target)
        }

        // TODO: Needs to delay for a microsecond as components inside a slot get messed up. Need to find a better way
        target.appendChild(document.adoptNode(el))
        DispatchEvent(host, 'slotchanged', { slot: slotKey, element: el })
    })
}

function componentObserverConfig(attributes: string[], slots?: SlotObjects | undefined) {
    const isArray = Array.isArray(attributes) && attributes.length
    const config: mutaionObserverConfig = {
        attributes: isArray ? true : false
    }

    if (config.attributes) {
        config.attributeFilter = attributes
    }

    if (slots) {
        config.childList = true
    }

    return config
}

function initHost(host: any) {
    host.constructed = true
    host.componentId = ID()
    host.state = {}
    host.elements = {}
    return host
}

function removeElement(el: Element) {
    const parent: Node = Get(el, 'parentNode', Get(el, 'host'))
    if (!parent) { return }
    parent.removeChild(el)
}

function ComponentCreateElements(
    host: any,
    elements: ComponentElements
) {
    const elStates: { [key: string]: ObserverInstance } = {}
    const state: { [key: string]: any | any[] } = {}

    function getEl(key: string) {
        const els = ArrayFrom(host.querySelectorAll(elements[key].selector))
        state[key] = els.length > 1 ? els : els[0]
        return state[key]
    }

    for (let key in elements) {
        const elementObject = elements[key]
        elStates[key] = Observer(getEl(key))
        elementObject.onChange = elementObject.onChange || emptyFn

        Object.defineProperty(state, key, {
            get: function () {
                return elStates[key].value
            },
            set: function (value) {
                if (value !== elStates[key].value) {
                    elStates[key].next(value)
                }
            }
        })

        elStates[key].subscribe(() => {
            RemoveElementEvents(elStates[key].previous)
            removeElement(elStates[key].previous)

            WhenState(host).then(() => {
                elementObject.onChange ? elementObject.onChange(elStates[key].value, host) : undefined
                win.genesis(`${host.tagName} element ${key} updated - ${host.componentId}`)
            })
        })
    }

    return state
}

function setStateProperty(host: any, key: string, property: ComponentProperty) {
    const prop = Object.assign({ format: (val: any) => val }, property)

    if (typeof prop.format !== 'function') {
        prop.format = (val: any) => val
    }

    const initialValue = prop.format(host.getAttribute(key) || (host as any)[key] || prop.initialValue, host)

    host.state[key] = Observer(initialValue, {
        initialValue,
        nextOnNew: prop.nextOnNew === false ? false : true,
        matchType: prop.matchType
    })

    Object.defineProperty(host, key, {
        get() {
            return host.state[key].value
        },
        set(value) {
            if (!host.state[key]) { return }

            const formattedValue = prop.format(value, host)

            if (!Equals(host.state[key].value, formattedValue)) {
                let doReflect = prop.reflect && formattedValue !== host.getAttribute(key) && formattedValue == value
                host.state[key].next(formattedValue)

                if (doReflect) {
                    host.setAttribute(key, formattedValue)
                }

                win.genesis(`${host.tagName} property ${key} updated - ${host.componentId}`)
            }
        }
    })

    if (typeof prop.onChange !== 'function') { return }

    const propertyNext = (newVal: any) => prop.onChange ? prop.onChange(newVal, host) : undefined

    return host.state[key].subscribe(propertyNext)
}

function ConnectedFn(element: any, params: ComponentArguments) {
    if (params.methods) {
        Object.keys(params.methods).forEach(
            (k: string) =>
                (element as any)[k] = params.methods ? params.methods[k](element) : undefined
        )
    }

    if (params.elements) {
        element.elements = ComponentCreateElements(element, params.elements)
    }

    if (params.properties) {
        Object.keys(params.properties).forEach(k =>
            setStateProperty(
                element,
                k,
                Get(params, `properties.${k}`)
            )
        )
    }

    const onConnectedFn = (params.onConnected || emptyFn)
    onConnectedFn(element)

    if (params.slots) {
        Object.keys(params.slots).forEach(key => {
            const slotEls = ArrayFrom(element.querySelectorAll(`[slot-ref="${key}"]`))
            slotEls.forEach(s => DispatchEvent(element, 'slotchanged', { slot: key, element: s }))
        })
    }

    win.genesis(`Connected ${element.tagName} - ${element.componentId}`)
}

function isUselessText(child: Node) {
    return child.nodeName === '#text' && !(/\S/gm.test(child.textContent || ''))
}

function cleanStart(host: any) {
    const actualChildren = []
    let i = host.childNodes.length

    while (i--) {
        !isUselessText(host.childNodes[i]) ?
            actualChildren.push(host.childNodes[i]) :
            host.removeChild(host.childNodes[i])
    }

    return actualChildren.reverse()
}

export default function CreateComponent(settings: ComponentArguments) {
    function _CreateComponent(host: any) {
        if (host.constructed) { return }
        win.genesis(`Creating ${settings.tag}`)

        // INIT
        host = initHost(host)
        win.genesis(`Init ${settings.tag} - ${host.componentId}`)

        // DOM CONNECTION
        host.onConnected = () => ConnectedFn(host, settings)
        host.onDisconnected = function OnDisconnected() {
            RemoveElementEvents(host)

            if (typeof settings.onDisconnected == 'function') {
                settings.onDisconnected(host)
            }

            if (host.state) {
                Object.keys(host.state).forEach(k => host.state[k].complete())
            }

            win.genesis(`Disconnected ${host.tagName} - ${host.componentId}`)
        }

        // CHILDREN
        const existingChildren = cleanStart(host)

        if (existingChildren[0]) {
            const fragment = document.createDocumentFragment()
            const temp = document.createElement('div')
            temp.innerHTML = settings.template || ''
            fragment.appendChild(temp)
            ArrayFrom(temp.children).forEach(c => host.insertBefore(c, existingChildren[0]))
        } else {
            host.innerHTML = settings.template || ''
        }

        const slotKeys = Object.keys(settings.slots || {})
        const hasSlots = slotKeys.length > 0

        // OBSERVER
        const nodeObserver = new MutationObserver(mutations => {
            let hasChildUpdates = false
            for (let i = 0; i < mutations.length; i++) {
                if (mutations[i].type === 'attributes') { attributeMutation(mutations[i]) }

                if (mutations[i].type === 'childList' && hasSlots) {
                    hasChildUpdates = true
                }
            }

            if (hasChildUpdates) {
                childMutation(host, settings.slots)
            }
        })

        const props = Object.keys(settings.properties || {})

        if (props.length || hasSlots) {
            nodeObserver.observe(host, componentObserverConfig(props, settings.slots))
            host.nodeObserver = nodeObserver
        }

        host.events = host.events || {}

        if (hasSlots && existingChildren.length) {
            childMutation(host, settings.slots)
        }

        DispatchEvent(host, 'ready', host)

        return host
    }

    ComponentObjects.add(settings, _CreateComponent)

    win.genesis(`${settings.tag} registered`)
}