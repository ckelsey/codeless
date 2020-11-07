import { ComponentArguments, ComponentElement, ComponentElements, ComponentProperty, ComponentState } from './component'
import ComponentObjects from './component-objects'
import AppendStyleElement from '../utils/dom/append-style-element'
import ID from '../utils/id'
import Equals from '../utils/checks/equals'
import RemoveElementEvents from './remove-element-events'
import Get from '../utils/objects/get'
import Observer, { ObserverInstance } from '../utils/observe/observer'
import DispatchEvent from '../utils/dom/dispatch-event'
import ArrayFrom from '../utils/conversion/array-from'

interface mutaionObserverConfig {
    attributes: boolean
    attributeFilter?: string[]
}

function emptyFn(v: any) { }

function attributeMutation(mutation: MutationRecord) {
    const target: any = mutation.target
    const attr = mutation.attributeName

    if (!target || !target.parentNode || !attr) { return }

    target[attr] = target.getAttribute(mutation.attributeName)
}

function componentObserverConfig(attributes: string[]) {
    const isArray = Array.isArray(attributes) && attributes.length
    const config: mutaionObserverConfig = {
        attributes: isArray ? true : false
    }

    if (config.attributes) {
        config.attributeFilter = attributes
    }

    return config
}

function initHost(host: ComponentElement) {
    host.constructed = true
    host.componentId = ID()
    host.state = {}
    host.elements = {}
    return host
}

function appendStyleIfNeeded(style: string, tagName: string) {
    if (!style || document.head.querySelector(`style[name="${tagName}"]`)) { return }

    AppendStyleElement(style, document.head, tagName)
}

function removeElement(el: Element) {
    const parent: Node = Get(el, 'parentNode', Get(el, 'host'))
    if (!parent) { return }
    parent.removeChild(el)
}

function ComponentCreateElements(
    host: ComponentElement,
    elements: ComponentElements
) {
    const elStates: { [key: string]: ObserverInstance } = {}
    const state: { [key: string]: Element | Element[] | ComponentElement | ComponentElement[] } = {}

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

            if (host.hasConnected) {
                return requestAnimationFrame(() => elementObject.onChange ? elementObject.onChange(elStates[key].value, host) : undefined)
            }

            host.addEventListener('connected', () => elementObject.onChange ? elementObject.onChange(elStates[key].value, host) : undefined)
        })
    }

    return state
}

function setStateProperty(host: ComponentElement, key: string, property: ComponentProperty) {
    if (typeof property.format !== 'function') {
        property.format = val => val
    }

    const initialValue = property.format(host.getAttribute(key) || (host as any)[key] || property.initialValue, host)

    host.state[key] = Observer(initialValue, {
        initialValue,
        nextOnNew: property.nextOnNew === false ? false : true,
        matchType: property.matchType
    })

    Object.defineProperty(host, key, {
        get() {
            return host.state[key].value
        },
        set(value) {
            if (!host.state[key]) { return }

            const formattedValue = property.format ? property.format(value, host) : value

            if (!Equals(host.state[key].value, formattedValue)) {
                host.state[key].next(formattedValue)
            }
        }
    })

    if (typeof property.onChange !== 'function') { return }

    const propertyNext = (newVal: any) => property.onChange ? property.onChange(newVal, host) : undefined

    if (host.hasConnected) {
        return host.state[key].subscribe(propertyNext)
    }

    host.addEventListener('connected', () => host.state[key].subscribe(propertyNext))
}

function ConnectedFn(element: ComponentElement, params: ComponentArguments) {
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
        Object.keys(params.properties).forEach(k => setStateProperty(
            element,
            k,
            params.properties ? params.properties[k] : undefined
        ))
    }

    setTimeout(() => {
        const onConnectedFn = (params.onConnected || emptyFn)
        onConnectedFn(element)
        DispatchEvent(element, 'connected', element)
        element.hasConnected = true
    }, 0)
}

function isUselessText(child: Node) {
    return child.nodeName === '#text' && !(/\S/gm.test(child.textContent || ''))
}

function cleanStart(host: ComponentElement) {
    const actualChildren = []
    let i = host.childNodes.length

    while (i--) {
        !isUselessText(host.childNodes[i]) ?
            actualChildren.push(host.childNodes[i]) :
            host.removeChild(host.childNodes[i])
    }

    return actualChildren
}

export default function CreateComponent(settings: ComponentArguments) {
    const tag = settings.tag

    function _CreateComponent(host: ComponentElement) {
        if (host.constructed) { return }

        host.hasConnected = false

        // STYLES
        appendStyleIfNeeded(settings.style || '', tag)

        // INIT
        host = initHost(host)

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
        }

        // CHILDREN
        const existingChildren = cleanStart(host)

        if (existingChildren[0]) {
            const fragment = document.createDocumentFragment()
            const temp = document.createElement('div')
            temp.innerHTML = settings.template || ''
            fragment.appendChild(temp)
            ArrayFrom(fragment.children).forEach(c => host.insertBefore(c, existingChildren[0]))
        } else {
            host.innerHTML = settings.template || ''
        }

        // OBSERVER
        // const nodeObserver = new MutationObserver(mutations => {
        //     for (let i = 0; i < mutations.length; i++) {
        //         if (mutations[i].type === 'attributes') { return attributeMutation(mutations[i]) }
        //     }
        // })

        const props = Object.keys(settings.properties || {})

        // if (props.length) {
        //     nodeObserver.observe(host, componentObserverConfig(props))
        //     host.nodeObserver = nodeObserver
        // }

        host.events = host.events || {}

        return host
    }

    ComponentObjects.addComponent(tag, _CreateComponent)

    return _CreateComponent
}