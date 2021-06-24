/**
 * TODO
 * - options
 * - filter
 * - decorator to do getter/setter automatically
 */
import Observer, { ObserverInstance, ObserverOptions } from '../../utils/observe/observer'
import EventObserver from '../../utils/observe/event-observer'
import Type from '../../utils/types/type'
import Pipe from '../../utils/function-helpers/pipe'
import ToJSON from '../../utils/conversion/to-json'
import ToBool from '../../utils/conversion/to-bool'
import ToNumber from '../../utils/conversion/to-number'
import IfInvalid from '../../utils/checks/if-invalid'
import { SantizedHTML } from '../../utils/validate/html'
import Create from '../../utils/dom/create'
import ID from '../../utils/id'
import SetAttribute from '../../utils/dom/set-attribute'
import IsNothing from '../../utils/checks/is-nothing'
import Get from '../../utils/objects/get'
import DispatchEvent from '../../utils/dom/dispatch-event'
import IfSelector from '../../utils/checks/if-selector'
import RemoveElement from '../../utils/dom/remove-element'
import IndexOf from '../../utils/checks/index-of'
import Try from '../../utils/try'

type PropertyValues = {
    autocomplete: 'on' | 'off' | boolean | string
    autofocus: boolean
    count: boolean
    disabled: boolean
    error: string | HTMLElement
    help: string | HTMLElement
    iconleft: string | HTMLElement
    iconright: string | HTMLElement
    input: string | HTMLElement
    inputid: string
    label: string | HTMLElement
    max: null | number
    min: null | number
    name: string
    pattern: null | string
    required: boolean
    type: string
    value: null | string
}

interface PropertyMetaItem {
    initial: any
    inputAttribute?: boolean
    formatter?: ObserverOptions['formatter']
    matchType?: boolean
}

type PropertyMetaItemMapper<Type> = { [Property in keyof Type]: PropertyMetaItem }
type PropertyMetaObject = PropertyMetaItemMapper<PropertyValues>

const html = require('index.html')
const styles = require('style.scss')

/** State properties that work on slots */
const slotProperties = ['label', 'error', 'help', 'input', 'iconleft', 'iconright']

/** Allowed types for the input element */
const types = ['text', 'email', 'search', 'tel', 'url', 'password']

/** A piped function that returns false if supplied value argument is not a bool */
const boolOrFalse = Pipe(ToBool, IfInvalid(false))

/** Returns a safe HTML string */
function htmlValue(value: string | HTMLElement) { return typeof value === 'string' ? SantizedHTML(value) : SantizedHTML(Get(value, 'innerHTML', '')) }

/** If given child does not already exist in element, append it */
function append(el: FieldText) { return function (element: HTMLElement) { el && !el.contains(element) ? el.appendChild(element) : undefined } }

/** If value is not true, return null */
function trueOrNull(value: boolean) { return value === true ? true : null }

/** If value is not a number, return null */
function numberOrNull(value: any) { return IsNothing(value) ? null : Pipe(ToNumber, IfInvalid(null))(value) }

/** Sets the textContent property if the element exists */
function setCountTextContent(countElement: Element | HTMLElement | null, text: string) { return countElement ? countElement.textContent = text : undefined }

/** Updates the text of the component's count element */
function setCountText(el: FieldText) { return el.count ? setCountTextContent(el.countElement, `${Get(el.value, 'length', 0)}${el.max ? `/${el.max}` : ''}`) : undefined }

/** If conditionFunction returns true, return modified value, else try to revert to the observer's current value(takes place in formatter so the observer value has not changed yet, hence not using previous value), and if no observer return null  */
function orRevert(conditionFunction: (value: any) => boolean, modifierFunction = (value: any) => value) {
    return function (value: any, observer: ObserverInstance | undefined) {
        return conditionFunction(value) ? modifierFunction(value) : observer ? observer.changed : undefined
    }
}

/** Gets the initial value for a state property */
function initialValue(host: any, key: string) {
    if (slotProperties.indexOf(key) > -1) {
        const child = host.querySelector(`[slot="${key}"]`)
        if (child) { return child }
    }

    const attrValue = host.getAttribute(key)

    if (attrValue !== null) { return attrValue }

    if (key === 'inputid') { return ID() }

    return (propertyMeta as any)[key].initial
}

/** Queries the shadowRoot of the given element with the given selector string */
function queryShadow(el: HTMLElement, selector: string) { return !el || !el.shadowRoot ? null : el.shadowRoot.querySelector(selector) }

/** Returns the slot of a given name in the shadowRoot of the given element */
function getSlot(el: HTMLElement, name: string) { return queryShadow(el, `[name="${name}"]`) }

/** Creates an element of given tag, slot name, and content value */
function elementCreateOptions(tag: string, slot: string) {
    return function (value?: any) {
        return Create({ tag, attributes: { slot }, properties: { innerHTML: htmlValue(value) } })
    }
}

/** Creates an input */
function createInput(_value: any) {
    return Create({ tag: 'input', attributes: { slot: 'input', placeholder: ' ' } })
}

/** Adds createdOn property for slotted elements */
function applyCreated(element: any) {
    element.createdOn = element.createdOn || new Date().getTime()
    return element
}

/** A formatter for an Observer. Tries to always return a DOM element */
function slotFormatter(createFn: any, applyFn: any = (v: any) => v, key?: string) {
    return function formatter(value: any) {
        const type = Type(value)

        if (['string', 'dom'].indexOf(type) === -1) { value = '' }

        if (type === 'dom') {
            if (value.slot !== key) { value.slot = key }
            return applyFn(value)
        }

        if (IfSelector(value)) {
            const element = document.body.querySelector(value)

            if (element) {
                if (element.slot !== key) { element.slot = key }
                return applyFn(element)
            }
        }

        const created = createFn(value)

        return applyFn(created)
    }
}

/** Sets a slotchange observed event. When the event occurs handles removing old slots and updating the component's state */
function slotEvent(host: any, name: string) {
    const slot = getSlot(host, name) as any

    if (!slot) { return }

    const eventName = `${name}SlotChange`

    if (!host.events[eventName]) {
        host.events[eventName] = EventObserver(slot, 'slotchange')
        host.events[eventName].subscribe(() => {
            const assigned = (Array.from(slot.assignedNodes()) as HTMLElement[]).sort((a: any, b: any) => {
                const createdOnA = a.createdOn
                const createdOnB = b.createdOn
                return !createdOnA && !createdOnB ? 0 : !createdOnA ? -1 : 1
            })

            const next = assigned.pop()

            if (next && !next.isSameNode(host.state[name].value)) {
                host.state[name].next(next)
            }

            while (assigned.length) {
                RemoveElement(assigned.pop())
            }


        })
    }
}

/** Data for all the state properties */
const propertyMeta: PropertyMetaObject = {
    autocomplete: {
        initial: 'on',
        inputAttribute: true,
        formatter: orRevert(value => typeof value === 'string', value => value === 'true' || value === true ? 'on' : value === 'false' || value === false ? 'off' : value)
    },
    autofocus: {
        initial: false,
        inputAttribute: true,
        formatter: boolOrFalse,
        matchType: true
    },
    count: {
        initial: false,
        formatter: boolOrFalse,
        matchType: true
    },
    disabled: {
        initial: false,
        inputAttribute: true,
        formatter: boolOrFalse,
        matchType: true
    },
    error: {
        initial: '',
        formatter: slotFormatter(elementCreateOptions('div', 'error'), applyCreated, 'error')
    },
    help: {
        initial: '',
        formatter: slotFormatter(elementCreateOptions('div', 'help'), applyCreated, 'help')
    },
    iconleft: {
        initial: '',
        formatter: slotFormatter(elementCreateOptions('div', 'iconleft'), applyCreated, 'iconleft')
    },
    iconright: {
        initial: '',
        formatter: slotFormatter(elementCreateOptions('div', 'iconright'), applyCreated, 'iconright')
    },
    input: {
        initial: null,
        formatter: slotFormatter(createInput, applyCreated, 'input')
    },
    inputid: {
        initial: '',
        inputAttribute: true,
        matchType: true
    },
    label: {
        initial: '',
        formatter: slotFormatter(elementCreateOptions('label', 'label'), applyCreated, 'label')
    },
    max: {
        initial: null,
        inputAttribute: true,
        formatter: numberOrNull
    },
    min: {
        initial: null,
        inputAttribute: true,
        formatter: numberOrNull
    },
    name: {
        initial: '',
        inputAttribute: true,
        matchType: true,
    },
    pattern: {
        initial: null,
        inputAttribute: true,
        formatter: orRevert(value => typeof value === 'string')
    },
    required: {
        initial: false,
        inputAttribute: true,
        formatter: boolOrFalse,
        matchType: true
    },
    type: {
        initial: 'text',
        inputAttribute: true,
        matchType: true,
        formatter: Pipe((value: string) => Try(() => value.toLowerCase()), IndexOf(types), IfInvalid(types[0]))
    },
    value: {
        initial: null,
        inputAttribute: true,
        formatter: (newValue: any, observer: ObserverInstance | undefined) => {
            if (typeof newValue === 'string') { return newValue }
            const valueType = Type(newValue)
            if (['number', 'function', 'date'].indexOf(valueType) > -1) { return newValue.toString() }
            if (['array', 'object'].indexOf(valueType) > -1 && observer) { return Pipe(ToJSON, IfInvalid(observer.changed))(newValue) }
            if (observer) { return observer.changed }
        }
    }
}

/** Returns an array of all the state property names */
function getInputAttributes() {
    return Object.keys(propertyMeta)
        .reduce(
            (result: string[], key: string) =>
                (propertyMeta as any)[key].inputAttribute ? result.concat([key]) : result,
            []
        )
}

/** Updates the input and label elements based on the given attribute keys, which defaults to all */
function updateInputAttributes(el: FieldText, changedAttributeKeys: string[] = getInputAttributes()) {
    if (!el || !el.state) { return }

    const input = el.input
    const label = el.label

    if (!input) { return }

    changedAttributeKeys.forEach(attr => {
        const value = (el.state as any)[attr].value

        if (attr === 'value') {
            if (input.value !== value && value !== undefined) { input.value = value }
            setCountText(el)
            el.setLabelPosition()
            const validationMessage = el.validationMessage
            if (el.error && !validationMessage) { el.error = validationMessage }
            return
        }

        if (attr === 'max') {
            setCountText(el)
            return SetAttribute(input, 'maxlength', value)
        }

        if (attr === 'min') { return SetAttribute(input, 'minlength', value) }

        if (attr === 'inputid') {
            SetAttribute(label as HTMLElement, 'for', value)
            return SetAttribute(input, 'id', value)
        }

        if (['required', 'disabled'].indexOf(attr) > -1) { return SetAttribute(input, attr, trueOrNull(value)) }

        if (attr === 'autofocus') {
            const autofocus = trueOrNull(value)
            SetAttribute(input, attr, autofocus)
            if (autofocus) { input.focus() }
            return
        }

        SetAttribute(input, attr, value)
    })
}

/** Subscribes to the component's state properties where needed */
function subscribeStates(el: FieldText) {
    el.state.count.subscribe((count: boolean) => count ? setCountText(el) : setCountTextContent(el.countElement, ''))

    el.state.error.subscribe((errorElement: HTMLElement) => {
        append(el)(errorElement)
        SetAttribute(el, 'error-message', !!el.validationMessage ? el.validationMessage : null)
    })

    el.state.help.subscribe(append(el))
    el.state.iconleft.subscribe(append(el))
    el.state.iconright.subscribe(append(el))

    el.state.input.subscribe((input: any) => {
        input.setAttribute('placeholder', ' ')
        append(el)(input)
        el.inputid = input.id || el.inputid
        updateInputAttributes(el)
    })

    el.state.label.subscribe(append(el))

    getInputAttributes().forEach(attr => (el.state as any)[attr].subscribe(() => updateInputAttributes(el, [attr])))
}

/** @description Input component that renders a text field */
export default class FieldText extends HTMLElement {
    static get observedAttributes() { return Object.keys(propertyMeta) }


    /** @description Stores the component's state observers */
    state: { [key: string]: ObserverInstance } = {}

    /** @description Browser based auto complete rule */
    get autocomplete(): PropertyValues['autocomplete'] { return this.state.autocomplete.value }
    set autocomplete(v) { this.state.autocomplete.next(v) }

    /** @description Sets focus to the input element on page load */
    get autofocus(): PropertyValues['autofocus'] { return this.state.autofocus.value }
    set autofocus(v) { this.state.autofocus.next(v) }

    /** @description Show the value character or not */
    get count(): PropertyValues['count'] { return this.state.count.value }
    set count(v) { this.state.count.next(v) }

    /** @description If true, makes the element not mutable, focusable, or even submitted with the form */
    get disabled(): PropertyValues['disabled'] { return this.state.disabled.value }
    set disabled(v) { this.state.disabled.next(v) }

    /** @description Updates the error slot element. Can be set using a text string, DOM selector string, or DOM element. DOM elements must have slot="error" attribute. Always returns a DOM element */
    get error(): PropertyValues['error'] { return this.state.error.value }
    set error(v) { this.state.error.next(v) }

    /** @description Updates the help slot element. Can be set using a text string, DOM selector string, or DOM element. DOM elements must have slot="help" attribute. Always returns a DOM element */
    get help(): PropertyValues['help'] { return this.state.help.value }
    set help(v) { this.state.help.next(v) }

    /** @description Updates the left icon slot element. Can be set using a text string, DOM selector string, or DOM element. DOM elements must have slot="iconleft" attribute. Always returns a DOM element */
    get iconleft(): PropertyValues['iconleft'] { return this.state.iconleft.value }
    set iconleft(v) { this.state.iconleft.next(v) }

    /** @description Updates the right icon slot element. Can be set using a text string, DOM selector string, or DOM element. DOM elements must have slot="iconright" attribute. Always returns a DOM element */
    get iconright(): PropertyValues['iconright'] { return this.state.iconright.value }
    set iconright(v) { this.state.iconright.next(v) }

    /** @description Updates the input slot element. Can be set using a text string, DOM selector string, or DOM element. DOM elements must have slot="input" attribute. Always returns a DOM element */
    get input(): HTMLInputElement | null { return this.state.input.value }
    set input(v) { this.state.input.next(v) }

    /** @description The id for the input element */
    get inputid(): PropertyValues['inputid'] { return this.state.inputid.value }
    set inputid(v) { this.state.inputid.next(v) }

    /** @description Updates the label slot element. Can be set using a text string, DOM selector string, or DOM element. DOM elements must have slot="label" attribute. Always returns a DOM element */
    get label(): PropertyValues['label'] { return this.state.label.value }
    set label(v) { this.state.label.next(v) }

    /** @description The maximum number of characters the value can have or null for no maximum */
    get max(): PropertyValues['max'] { return this.state.max.value }
    set max(v) { this.state.max.next(v) }

    /** @description The minimum number of characters the value can have or null for no minimum */
    get min(): PropertyValues['min'] { return this.state.min.value }
    set min(v) { this.state.min.next(v) }

    /** @description The name for the input element */
    get name(): PropertyValues['name'] { return this.state.name.value }
    set name(v) { this.state.name.next(v) }

    /** @description Specifies a regular expression the input element's value should match */
    get pattern(): PropertyValues['pattern'] { return this.state.pattern.value }
    set pattern(v) { this.state.pattern.next(v) }

    /** @description Specifies if the input element is required for form submission */
    get required(): PropertyValues['required'] { return this.state.required.value }
    set required(v) { this.state.required.next(v) }

    /** @description Specifies the type of text input */
    get type(): PropertyValues['type'] { return this.state.type.value }
    set type(v) { this.state.type.next(v) }

    /** @description Specifies the value of the input */
    get value(): PropertyValues['value'] { return this.state.value.value }
    set value(v) { this.state.value.next(v) }

    /** @description Read-only element that displays the input's value length */
    get countElement() { return queryShadow(this, '.field-count-text') }

    /** @description Read-only focused state of the input element */
    get focused() { return !!document.activeElement && this.inputid === document.activeElement.id }

    /** @description Read-only form element if found */
    get form() { return this.closest('form') }

    /** @description If the component has a value, read-only */
    get isempty() { return this.value == '' || this.value == undefined }

    /** @description Read-only validity object for the input element */
    get validity(): ValidityState | undefined { return this.input ? this.input.validity : undefined }

    /** @description The custom or native error message */
    get validationMessage(): string { return Get(this, 'input.validationMessage', '') }
    set validationMessage(error) { this.input ? this.input.setCustomValidity(error) : undefined }

    /** @description Object that stores the component's observed events, i.e. slotchange, focus, input... */
    events: { [key: string]: ObserverInstance } = {}

    constructor() {
        super()

        if (!this.shadowRoot) {
            const shadowRoot = this.attachShadow({ mode: 'open' })
            shadowRoot.innerHTML = `<style>${styles}</style>${html}`
        }

        this.state = Object.freeze(Object.keys(propertyMeta).reduce(
            (result: any, key: string) =>
                Object.assign(result, {
                    [key]: Observer(initialValue(this, key),
                        {
                            matchType: (propertyMeta as any)[key].matchType,
                            formatter: (propertyMeta as any)[key].formatter
                        }
                    )
                }),
            {}
        ))

        subscribeStates(this)
    }

    /** @description Sets the component's focused and empty attributes that changes the label position */
    setLabelPosition() {
        const focused = this.focused.toString()
        const empty = this.isempty.toString()
        const attrFocused = this.getAttribute('focused')
        const attrEmpty = this.getAttribute('empty')

        if (focused !== attrFocused) { this.setAttribute('focused', focused) }
        if (empty !== attrEmpty) { this.setAttribute('empty', empty) }

        return focused || !empty
    }

    /** 
     * @param name The name of the attribute
     * @param _oldValue The previous value of the attribute
     * @param newValue The new value of the attribute
     * @description Called when a component's attribute has changed 
     */
    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if ((this.state as any)[name]) {
            (this.state as any)[name].next(newValue)
        }
    }

    /** @description Called when the component is added to the DOM */
    connectedCallback() {
        slotProperties.forEach((key: string) => slotEvent(this, key))

        /** If you hit enter in the input, it will emit a formsubmit event which is helpful for non-form ajax submissions */
        if (!this.events.keydown) {
            this.events.keydown = EventObserver(this, 'keydown')
            this.events.keydown.subscribe((e: KeyboardEvent) => {
                if (e.key && e.key.toLowerCase() === 'enter') {
                    DispatchEvent(this, 'formsubmit', { originalEvent: e, field: this })
                }
            })
        }

        /** Mirrors component's value with the input's */
        if (!this.events.input) {
            this.events.input = EventObserver(this, 'input')
            this.events.input.subscribe(() => this.state.value.next(Get(this, 'input.value', null)))
        }

        /** For pageload autocompletion by the browser */
        if (!this.events.animationStart) {
            this.events.animationStart = EventObserver(queryShadow(this, '.field-input') as HTMLElement, 'animationstart')
            this.events.animationStart.subscribe(() => this.setLabelPosition())
        }

        if (!this.events.focus) {
            this.events.focus = EventObserver(this, 'focus')
            this.events.focus.subscribe(() => this.setLabelPosition())
        }

        if (!this.events.blur) {
            this.events.blur = EventObserver(this, 'blur')
            this.events.blur.subscribe(() => {
                this.setLabelPosition()
                this.error = this.validationMessage
            })
        }

        this.setLabelPosition()
    }

    /** @description Called when the component is removed to the DOM */
    disconnectedCallback() {
        Object.keys(this.events).forEach(key => {
            this.events[key].complete()
            delete this.events[key]
        })
    }
}

window.customElements.define('field-text', FieldText)