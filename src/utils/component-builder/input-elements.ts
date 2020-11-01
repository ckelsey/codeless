import { ComponentElement, ComponentElements } from "../component-builder/component"
import DispatchEvent from "../dom/dispatch-event"
import GetInputValue from "../dom/get-input-value"
import SetInputValue from "../dom/set-input-value"
import Get from "../objects/get"
import EventObserver from '../observe/event-observer'
import UpdateLabelUp from './update-label-up'
import InputValueType from '../dom/input-value-type'
import Remove from "../objects/remove"
import Set from "../objects/set"
import ID from "../id"
import IsNoValue from "../types/is-no-value"

export const isBoolInput = (input: HTMLElement) => ['radio', 'checkbox'].indexOf(Get(input, 'type')) != -1
export const isOnChangeInput = (input: HTMLElement) => ['radio', 'checkbox'].indexOf(Get(input, 'type')) != -1 || Get(input, 'tagName.toLowerCase()') == 'select'
export const updateFocusState = (input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, host: any, focused: boolean) => () => {
    host.focused = focused
    if (!isBoolInput(input)) { UpdateLabelUp(input, host)() }
}

function setAttr(input: HTMLElement) {
    if (!input) { return () => { } }

    return function setAttrInner(key: string, value: any) {
        const empty = IsNoValue(value) || value === false
        input[empty ? 'removeAttribute' : 'setAttribute'](key, empty ? undefined : value)
    }
}

const passDownAttributes = ['autocomplete', 'autofocus', 'disabled', 'name', 'readonly', 'required', 'willValidate', 'pattern']
export const inputId = (id?: any) => `input-${id || ID()}`

export const inputElement = {
    selector: 'input, textarea, select',
    onChange(input: any, host: any) {
        const setInputAttr = setAttr(input)
        const inputValueType = InputValueType(input)

        input.events = {
            animationstart: EventObserver(input, 'animationstart').subscribe(UpdateLabelUp(input, host)),
            label: host.state.label.subscribe((label: string) => input.placeholder = label),
            id: host.state.id.subscribe((id: string) => setInputAttr('id', inputId(id))),
            focusIn: EventObserver(input, 'focusin').subscribe(updateFocusState(input, host, true)),
            focusOut: EventObserver(input, 'focusout').subscribe(updateFocusState(input, host, false)),
            value: host.state.value.subscribe((value: any) => {
                const thisVal = GetInputValue(input)

                if (value !== thisVal) {
                    const rando = Math.random()
                    SetInputValue(input, value)
                    host.isempty = rando
                    host.isvalid = rando
                    host.count = Get(value, 'length', 0)
                }

                DispatchEvent(host, 'valuechange', host)
            }),
        }

        const inputEventName = isOnChangeInput(input) ? 'change' : 'input'

        input.events.input = EventObserver(input, inputEventName).subscribe(() => {
            const latestVal = GetInputValue(input)

            if (host.value === latestVal) { return }

            host.value = latestVal
            host.count = Get(latestVal, 'length', 0)

            DispatchEvent(host, 'valuechange', host)
        })

        if (host.state.isempty) {
            input.events.isempty = host.state.isempty.subscribe(() => requestAnimationFrame(updateFocusState(input, host, true)))
        }

        if (host.state.error) {
            input.events.error = host.state.error.subscribe((error: string) => input.setCustomValidity(error))
        }

        if (host.state.max) {
            input.events.max = host.state.max.subscribe((max: any) => setInputAttr(inputValueType == 'string' ? 'maxlength' : 'max', max))
        }

        if (host.state.min) {
            input.events.min = host.state.min.subscribe((min: any) => setInputAttr(inputValueType == 'string' ? 'minlength' : 'min', min))
        }

        passDownAttributes.forEach(attr => {
            if (host.state[attr]) {
                input.events[attr] = host.state[attr].subscribe((val: any) => setInputAttr(attr, val))
            }
        })
    }
}

export const labelElement = {
    selector: 'label',
    onChange: (el: ComponentElement, host: ComponentElement) => {
        el.events = {
            error: host.state.error.subscribe((error: string) => el.setAttribute('error', error)),
            id: host.state.id.subscribe((id: string) => el.setAttribute('for', inputId(id))),
            content: host.state.label.subscribe((label: string) => {
                el.innerHTML = label
                host.classList[label ? 'remove' : 'add']('no-label')
            })
        }
    }
}

export const helpTextElement = {
    selector: '.field-help-text',
    onChange: (el: ComponentElement, host: ComponentElement) => el.events = {
        content: host.state.helptext.subscribe((text: string) => el.innerHTML = text)
    }
}

export const countElement = {
    selector: '.field-count-text',
    onChange: (el: ComponentElement, host: ComponentElement) => {
        if (!host.state.showcount) { return }
        el.events = {}
        el.events.showcount = host.state.showcount.subscribe((showcount: string) => {
            function setCount() {
                const max = Get(host, 'max') ? `${Get(host, 'max')}/` : ''
                const count = Get(host, 'count') || 0
                el.textContent = `(${max}${count})`
            }

            if (!showcount) {
                Get(el, 'events.count()')
                Remove(el, 'events.count')
                Get(el, 'events.max()')
                Remove(el, 'events.max')
            }

            if (showcount) {
                if (host.state.count && typeof Get(el, 'events.count') !== 'function') {
                    Set(el, 'events.count', host.state.count.subscribe(setCount))
                }

                if (host.state.max && typeof Get(el, 'events.max') !== 'function') {
                    Set(el, 'events.max', host.state.count.subscribe(setCount))
                }
            }
        })
    }
}

export default function InputElements(): ComponentElements {
    return {
        input: inputElement,
        label: labelElement,
        helpText: helpTextElement,
        count: countElement
    }
}