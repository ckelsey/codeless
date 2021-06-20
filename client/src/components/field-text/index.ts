/**
 * TODO
 * - docs
 * - testing
 * - aria/accessibility
 */

import html from 'index.html'
import styles from 'style.scss'
import Observer, { ObserverInstance } from '../../utils/observe/observer'
import { slotEvent, getSlottedElement, getSlot } from '../../utils/dom/web-components/field-utils/slot-element'
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

const innerHTMLValue = (value: string | HTMLElement) => typeof value === 'string' ? SantizedHTML(value) : Get(value, 'innerHTML', '')
const elementCreateOptions = (tag: string, slot: string) => (value?: any) => ({ tag, attributes: { slot }, properties: { innerHTML: innerHTMLValue(value) } })
const appendToSlot = (el: FieldText) => (element: HTMLElement) => el && !el.contains(element) ? el.appendChild(element) : undefined
const trueOrNull = (value: boolean) => value === true ? true : null
const setCountText = (el: FieldText) => el.count ? el.countElement.textContent = `${Get(el.value, 'length', 0)}${el.max ? `/${el.max}` : ''}` : undefined
const inputAttributes = ['autocomplete', 'autofocus', 'disabled', 'inputid', 'max', 'min', 'name', 'pattern', 'required', 'type', 'value']

function attachShadow(el: FieldText) {
    if (!el.shadowRoot) {
        const shadowRoot = el.attachShadow({ mode: 'open' })
        shadowRoot.innerHTML = `<style>${styles}</style>${html}`
    }
}

function slotFormatter(createOptions = elementCreateOptions('div', '')) {
    return function slotFormatterInner(element: string | HTMLElement, observer: ObserverInstance) {
        const type = Type(element)
        if (type === 'string') { return Create(createOptions(element)) }
        if (type === 'dom') { return element }
        if (observer) { return observer.changed }
        return ''
    }
}

function updateInputAttributes(el: FieldText, attrs: string[] = inputAttributes) {
    if (!el || !el.state) { return }

    const input = el.input
    const label = el.label

    if (!input) { return }

    attrs.forEach(attr => {
        const value = el.state[attr].value

        if (attr === 'value') {
            if (input.value !== value && value !== undefined) { input.value = value }
            setCountText(el)
            el.setLabelPosition()
            return requestAnimationFrame(() => {
                const error = el.validationMessage
                if (!error) { el.error = error }
            })
        }

        if (attr === 'max') {
            setCountText(el)
            return SetAttribute(input, 'maxlength', value)
        }

        if (attr === 'min') { return SetAttribute(input, 'minlength', value) }
        if (attr === 'inputid') {
            SetAttribute(label, 'for', value)
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

function setStates(el: FieldText) {
    el.state.autocomplete = Observer('on', {
        formatter: (newValue, observer) => {
            if (typeof newValue === 'string') {
                if (newValue === 'true') { return 'on' }
                if (newValue === 'false') { return 'off' }
                return newValue
            }
            if (observer) { return observer.changed }
        }
    })

    el.state.autofocus = Observer(false, { formatter: Pipe(ToBool, IfInvalid(false)), matchType: true })
    el.state.count = Observer(false, { formatter: Pipe(ToBool, IfInvalid(false)), matchType: true })
    el.state.disabled = Observer(false, { formatter: Pipe(ToBool, IfInvalid(false)), matchType: true })
    el.state.error = Observer('', { noInit: true, formatter: slotFormatter(elementCreateOptions('div', 'error')) as any })
    el.state.help = Observer('', { noInit: true, formatter: slotFormatter(elementCreateOptions('div', 'help')) as any })
    el.state.iconleft = Observer('', { noInit: true, formatter: slotFormatter(elementCreateOptions('div', 'iconleft')) as any })
    el.state.iconright = Observer('', { noInit: true, formatter: slotFormatter(elementCreateOptions('div', 'iconright')) as any })

    el.state.input = Observer(null, {
        noInit: true,
        formatter: (input, observer) => {
            if (Type(input) === 'dom') { return input }
            if (observer) { return observer.changed }
        }
    })

    el.state.inputid = Observer(ID(), { matchType: true })
    el.state.label = Observer('', { noInit: true, formatter: slotFormatter(elementCreateOptions('label', 'label')) as any })
    el.state.max = Observer(null, { formatter: value => IsNothing(value) ? null : Pipe(ToNumber, IfInvalid(null))(value) })
    el.state.min = Observer(null, { formatter: value => IsNothing(value) ? null : Pipe(ToNumber, IfInvalid(null))(value) })
    el.state.name = Observer('', { matchType: true })
    el.state.pattern = Observer(null)
    el.state.required = Observer(false, { formatter: Pipe(ToBool, IfInvalid(false)), matchType: true })

    el.state.type = Observer('text', {
        matchType: true,
        formatter: (newValue, observer) => {
            if (typeof newValue === 'string') { return newValue }
            if (observer) { return observer.changed }
        }
    })

    el.state.value = Observer(null, {
        formatter: (newValue, observer) => {
            if (typeof newValue === 'string') { return newValue }
            const valueType = Type(newValue)
            if (['number', 'function', 'date'].indexOf(valueType) > -1) { return newValue.toString() }
            if (['array', 'object'].indexOf(valueType) > -1 && observer) { return Pipe(ToJSON, IfInvalid(observer.changed))(newValue) }
            if (observer) { return observer.changed }
        }
    })
}

function subscribeStates(el: FieldText) {
    el.state.count.subscribe((count: boolean) => count ? setCountText(el) : el.countElement.textContent = '')

    el.state.error.subscribe((errorElement: HTMLElement) => {
        appendToSlot(el)(errorElement)
        const error = el.validationMessage
        const currentErrorMsg = el.getAttribute('error-message')
        if (currentErrorMsg !== error) { SetAttribute(el, 'error-message', !!error ? error : null) }
    })

    el.state.help.subscribe(appendToSlot(el))

    el.state.iconleft.subscribe(appendToSlot(el))
    el.state.iconright.subscribe(appendToSlot(el))

    el.state.input.subscribe((input: any) => {
        input.setAttribute('placeholder', ' ')
        appendToSlot(el)(input)
        el.inputid = input.id || el.inputid
        updateInputAttributes(el)
    })

    el.state.label.subscribe(appendToSlot(el))

    inputAttributes.forEach(attr => el.state[attr].subscribe(() => updateInputAttributes(el, [attr])))
}
export default class FieldText extends HTMLElement {
    static get observedAttributes() { return inputAttributes.concat(['count', 'error', 'help', 'iconleft', 'iconright', 'input', 'label']) }

    state: { [key: string]: ObserverInstance } = {}

    get autocomplete() { return this.state.autocomplete.value }
    set autocomplete(v) { this.state.autocomplete.next(v) }

    get autofocus() { return this.state.autofocus.value }
    set autofocus(v) { this.state.autofocus.next(v) }

    get count() { return this.state.count.value }
    set count(v) { this.state.count.next(v) }

    get disabled() { return this.state.disabled.value }
    set disabled(v) { this.state.disabled.next(v) }

    get error() { return this.state.error.value }
    set error(v) { this.state.error.next(v) }

    get help() { return this.state.help.value }
    set help(v) { this.state.help.next(v) }

    get iconleft() { return this.state.iconleft.value }
    set iconleft(v) { this.state.iconleft.next(v) }

    get iconright() { return this.state.iconright.value }
    set iconright(v) { this.state.iconright.next(v) }

    get inputid() { return this.state.inputid.value }
    set inputid(v) { this.state.inputid.next(v) }

    get label() { return this.state.label.value }
    set label(v) { this.state.label.next(v) }

    get max() { return this.state.max.value }
    set max(v) { this.state.max.next(v) }

    get min() { return this.state.min.value }
    set min(v) { this.state.min.next(v) }

    get name() { return this.state.name.value }
    set name(v) { this.state.name.next(v) }

    get pattern() { return this.state.pattern.value }
    set pattern(v) { this.state.pattern.next(v) }

    get required() { return this.state.required.value }
    set required(v) { this.state.required.next(v) }

    get type() { return this.state.type.value }
    set type(v) { this.state.type.next(v) }

    get value() { return this.state.value.value }
    set value(v) { this.state.value.next(v) }

    get countElement() {
        const non = { textContent: '' }
        if (!this.shadowRoot) { return non }
        return this.shadowRoot.querySelector('.field-count-text') || non
    }
    get focused() { return !!document.activeElement && this.inputid === document.activeElement.id }
    get form() { return this.closest('form') }
    get input() { return this.state.input.value }
    get isempty() { return this.value == '' || this.value == undefined }
    get validity() { return this.input.validity }
    get validationMessage() { return this.input.validationMessage }
    set validationMessage(error) { this.input.setCustomValidity(error) }

    events: { [key: string]: ObserverInstance } = {}

    constructor() {
        super()
        attachShadow(this)
        setStates(this)
        subscribeStates(this)
    }

    setLabelPosition() {
        const focused = this.focused.toString()
        const empty = this.isempty.toString()
        const attrFocused = this.getAttribute('focused')
        const attrEmpty = this.getAttribute('empty')

        if (focused !== attrFocused) { this.setAttribute('focused', focused) }
        if (empty !== attrEmpty) { this.setAttribute('empty', empty) }
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) { if (this.state[name]) { this.state[name].next(newValue) } }

    connectedCallback() {
        this.state.input.next(getSlottedElement(this, 'input', elementCreateOptions('input', 'input')(this.input)))
        slotEvent(this, getSlot(this, 'input'), elementCreateOptions('input', 'input')(this.input))
        slotEvent(this, getSlot(this, 'label'), elementCreateOptions('label', 'label')(this.label))
        slotEvent(this, getSlot(this, 'error'), elementCreateOptions('div', 'error')(this.error))
        slotEvent(this, getSlot(this, 'help'), elementCreateOptions('div', 'help')(this.help))
        slotEvent(this, getSlot(this, 'iconleft'), elementCreateOptions('div', 'iconleft')(this.iconleft))
        slotEvent(this, getSlot(this, 'iconright'), elementCreateOptions('div', 'iconright')(this.iconright))

        if (!this.events.keydown) {
            this.events.keydown = EventObserver(this, 'keydown')
            this.events.keydown.subscribe((e: KeyboardEvent) => {
                if (e.key && e.key.toLowerCase() === 'enter') {
                    DispatchEvent(this, 'formsubmit', { originalEvent: e, field: this })
                }
            })
        }

        if (!this.events.input) {
            this.events.input = EventObserver(this, 'input')
            this.events.input.subscribe(() => this.state.value.next(this.input.value))
        }

        if (!this.events.focus) {
            this.events.focus = EventObserver(this, 'focus')
            this.events.focus.subscribe(() => this.setLabelPosition())
        }

        if (!this.events.blur) {
            this.events.blur = EventObserver(this, 'blur')
            this.events.blur.subscribe(() => {
                this.setLabelPosition()
                requestAnimationFrame(() => this.error = this.validationMessage)
            })
        }

        if (!this.events.animationStart) {
            this.events.animationStart = EventObserver((this.shadowRoot as ShadowRoot).querySelector('.field-input') as HTMLElement, 'animationstart')
            this.events.animationStart.subscribe(() => this.setLabelPosition())
        }

        this.setLabelPosition()
    }

    disconnectedCallback() {
        Object.keys(this.events).forEach(key => {
            this.events[key].complete()
            delete this.events[key]
        })
    }
}

window.customElements.define('field-text', FieldText)