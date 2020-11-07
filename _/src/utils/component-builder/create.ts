import { ComponentArguments, ComponentElements, ComponentProperty, SlotObjects } from './component'
import ComponentObjects from './component-objects'
import WhenState from './when-state'
import ID from '../id'
import Equals from '../checks/equals'
import RemoveElementEvents from './remove-element-events'
import Get from '../objects/get'
import Observer from '../observe/observer'
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
    childList?: boolean,
    subtree?: boolean
}

function emptyFn() { }

function attributeMutation(mutation: MutationRecord) {
    const target: any = mutation.target
    const attr = mutation.attributeName

    if (!target || !target.parentNode || !attr) { return }

    target[attr] = target.getAttribute(mutation.attributeName)
}

function checkSlots(host: any, slotSettings: SlotObjects | undefined) {
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
        // target.appendChild(el)
        DispatchEvent(host, 'slotchanged', { slot: slotKey, element: el })
    })
}

function childMutation(host: any, settings: ComponentArguments) {
    checkSlots(host, settings.slots)

    const elements = settings.elements || {}

    Object.keys(elements).forEach(key => {
        if (!elements[key] || typeof elements[key].onChange !== 'function') { return }

        const el = host.elements.__getElement(key)
        console.log('el', el)

        if (el && !Equals(el, host.elements.__elementCache[key])) {
            host.elements[key] = el
        }
    })
}

function componentObserverConfig(attributes: string[], slots?: SlotObjects | undefined) {
    const isArray = Array.isArray(attributes) && attributes.length
    const config: mutaionObserverConfig = {
        attributes: isArray ? true : false,
        childList: true,
        subtree: true
    }

    if (config.attributes || slots) {
        config.attributeFilter = attributes || []

        if (slots) {
            config.attributeFilter.push('slot-ref')
        }
    }

    return config
}

function initHost(host: any) {
    host.constructed = true
    host.componentId = host.componentId || ID()
    host.state = host.state || {}
    host.elements = host.elements || {}
    return host
}

function ComponentCreateElements(
    host: any,
    elements: ComponentElements
) {
    const state: { [key: string]: any | any[] } = {
        __elementCache: [],
        __getElement: function getEl(key: string) {
            const els = ArrayFrom(host.querySelectorAll(elements[key].selector))
            return els.length > 1 ? els : els[0]
        }
    }

    for (let key in elements) {
        const elementObject = elements[key]

        state.__elementCache[key] = state.__getElement(key)

        Object.defineProperty(state, key, {
            get: function () {
                return state.__getElement(key)
            },
            set: function (value) {
                WhenState(host).then(() => typeof elementObject.onChange !== 'function' ? undefined : elementObject.onChange(value, host))
            }
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

    if (!host.state[key]) {
        host.state[key] = Observer(initialValue, {
            initialValue,
            nextOnNew: prop.nextOnNew === false ? false : true,
            matchType: prop.matchType
        })
    }

    if (!Object.getOwnPropertyDescriptor(host, key)) {
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
    }

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

    requestAnimationFrame(() => element.setAttribute('ready', 'true'))

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
        // Do not re-init
        if (host.constructed) { return }

        win.genesis(`Creating ${settings.tag}`)

        // INIT
        host = initHost(host)
        win.genesis(`Init ${settings.tag} - ${host.componentId}`)

        // DOM CONNECTION
        host.onConnected = () => ConnectedFn(host, settings)
        host.onDisconnected = function OnDisconnected() {
            // Gaurd against appendChild and adoptNode reassignments
            requestAnimationFrame(() => {
                if (host.parentNode) { return }

                RemoveElementEvents(host)

                if (typeof settings.onDisconnected == 'function') {
                    settings.onDisconnected(host)
                }

                if (host.state) {
                    Object.keys(host.state).forEach(k => host.state[k].complete())
                }
            })

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
                childMutation(host, settings)
            }
        })

        nodeObserver.observe(host, componentObserverConfig(['events'].concat(Object.keys(settings.properties || {})), settings.slots))
        host.nodeObserver = nodeObserver

        if (host.events !== undefined) {
            host.state.__events = Observer({}, {
                nextOnNew: true,
                matchType: true
            })

            Object.defineProperty(host, 'events', {
                get() {
                    return host.state.__events.value
                },
                set(value) {
                    Object.keys(host.state.__events.value).forEach((key: string) => {
                        if (typeof host.state.__events.value[key] == 'function') { host.state.__events.value[key]() }
                    })

                    host.state.__events.next(value)
                }
            })
        }


        if (hasSlots && existingChildren.length) {
            checkSlots(host, settings.slots)
        }

        DispatchEvent(host, 'ready', host)

        return host
    }

    ComponentObjects.add(settings, _CreateComponent)

    win.genesis(`${settings.tag} registered`)
}