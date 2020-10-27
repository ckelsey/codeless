import { ComponentElements } from "../component-builder/component"
import Get from "../objects/get"
import EventObserver from '../observe/event-observer'
import UpdateLabelUp from './update-label-up'

export const isBoolInput = (input: HTMLElement) => ['radio', 'checkbox'].indexOf(Get(input, 'type')) != -1
export const updateFocusState = (input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, host: any, focused: boolean) => () => {
    host.focused = focused

    if (!isBoolInput(input)) {
        UpdateLabelUp(input, host)()
    }
}

const inputId = (id: string) => `input-${id}`

export default function InputElements(): ComponentElements {
    return {
        input: {
            selector: 'input, textarea, select',
            onChange(_input, host) {
                const input = _input as any
                input.events = {
                    animationstart: EventObserver(input, 'animationstart').subscribe(UpdateLabelUp(input, host)),
                    label: host.state.label.subscribe((label: string) => input.placeholder = label),
                    ready: EventObserver(host, 'ready').subscribe(host.setAttribute('ready', 'true')),
                    id: host.state.id.subscribe((id: string) => input.setAttribute('id', inputId(id))),
                    focusIn: EventObserver(input, 'focusin').subscribe(updateFocusState(input, host, true)),
                    focusOut: EventObserver(input, 'focusout').subscribe(updateFocusState(input, host, false)),
                    input: EventObserver(input, 'input').subscribe(() => {
                        const latestVal = input.value

                        if (host.value !== latestVal) {
                            host.value = latestVal
                            host.count = Get(latestVal, 'length', 0)
                        }
                    }),
                    value: host.state.value.subscribe((value: any) => {
                        const latestVal = value

                        if (latestVal !== input.value) {
                            input.value = latestVal
                            host.isempty = Math.random()
                            host.isvalid = Math.random()
                            host.count = Get(latestVal, 'length', 0)
                        }
                    }),
                }
            }
        },
        label: {
            selector: 'label',
            onChange: (el, host) => {
                el.events = {
                    error: host.state.error.subscribe((error: string) => el.setAttribute('error', error)),
                    id: host.state.id.subscribe((id: string) => el.setAttribute('for', inputId(id))),
                    content: host.state.label.subscribe((label: string) => {
                        el.innerHTML = label
                        host.classList[label ? 'remove' : 'add']('no-label')
                    })
                }
            }
        },
        helpText: {
            selector: '.field-help-text',
            onChange: (el, host) => el.events = {
                content: host.state.helptext.subscribe((text: string) => el.innerHTML = text)
            }
        },
        count: {
            selector: '.field-count-text',
            onChange: (el, host) => {
                if (!host.state.showcount) { return }
                el.events = {}
                el.events.showcount = host.state.showcount.subscribe((showcount: string) => {
                    function setCount() {
                        const max = host.max ? `${host.max}/` : ''
                        const count = host.count || 0
                        el.textContent = `(${max}${count})`
                    }

                    if (!showcount) {
                        if (typeof el.events.count == 'function') {
                            el.events.count()
                            delete el.events.count
                        }

                        if (typeof el.events.max == 'function') {
                            el.events.max()
                            delete el.events.max
                        }
                    }

                    if (showcount) {
                        if (typeof el.events.count !== 'function') {
                            el.events.count = host.state.count.subscribe(setCount)
                        }

                        if (typeof el.events.max !== 'function') {
                            el.events.max = host.state.max.subscribe(setCount)
                        }
                    }
                })
            }
        }
    }
}