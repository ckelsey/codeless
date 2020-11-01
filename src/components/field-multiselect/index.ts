import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import ValidateHtml from '../../utils/validate/html'
import IfInvalid from '../../utils/checks/if-invalid'
import ToString from '../../utils/conversion/to-string'
import ToArray from '../../utils/conversion/to-array'
import CommasToArray from '../../utils/conversion/commas-to-array'
import ToOptions, { OptionsObject } from '../../utils/conversion/to-options'
import ArrayFrom from '../../utils/conversion/array-from'
import RemoveElement from '../../utils/dom/remove-element'
import Get from '../../utils/objects/get'
import EventObserver from '../../utils/observe/event-observer'
import GetEventTarget from '../../utils/dom/get-event-target'
import GetInputValue from '../../utils/dom/get-input-value'
import SetInputValue from '../../utils/dom/set-input-value'
import ToBool from '../../utils/conversion/to-bool'
import InputElements from '../../utils/component-builder/input-elements'
import './style.scss'
import '../drop-down'
import '../field-checkbox'

const { helpText, count } = InputElements()

const FieldMultiselect: ComponentArguments = {
    tag: 'field-multiselect',
    template: require('./index.html'),
    properties: {
        label: { format: Pipe(ToString, IfInvalid(''), (value: string) => ValidateHtml(value).sanitized) },
        value: { format: Pipe(CommasToArray, ToArray, IfInvalid([])) },
        options: { format: Pipe(ToArray, CommasToArray, ToOptions) },
        count: { format: (_val, host) => host.value.length },
        showcount: { format: Pipe(ToBool, IfInvalid(false)) },
        helptext: { format: Pipe(ToString, IfInvalid(''), (value: string) => ValidateHtml(value).sanitized) },
    },
    elements: {
        dropdown: {
            selector: '.field-multiselect-dropdown',
            onChange(el, host) {
                el.events = {
                    options: host.state.options.subscribe((options: OptionsObject[]) => {
                        ArrayFrom(el.querySelectorAll('[slot-ref="item"]')).forEach(RemoveElement)

                        const len = options.length
                        let index = 0

                        while (index < len) {
                            const optionEl = document.createElement('field-checkbox') as any
                            optionEl.setAttribute('name', options[index].value)
                            optionEl.setAttribute('slot-ref', 'item')
                            optionEl.setAttribute('label', options[index].textContent)
                            el.appendChild(optionEl)
                            index = index + 1
                        }
                    }),
                    label: host.state.label.subscribe((label: string) => {
                        ArrayFrom(el.querySelectorAll('[slot-ref="label"]')).forEach(RemoveElement)

                        const labelEl = document.createElement('field-checkbox') as any
                        labelEl.setAttribute('label', label)
                        labelEl.setAttribute('slot-ref', 'label')
                        el.appendChild(labelEl)
                    })
                }
            }
        },
        helpText,
        count
    },
    onConnected(host) {
        host.events = host.events || {}

        function getData() {
            const options = Get(host, 'options', []).map((o: OptionsObject) => o.value)

            return {
                options,
                currentValue: Get(host, 'value'),
                optionElements: ArrayFrom(host.querySelectorAll('field-checkbox[slot-ref="item"] input')),
                labelElement: host.querySelector('field-checkbox[slot-ref="label"]') as any
            }
        }

        host.events.updateInputs = EventObserver(host, 'change', { takeLast: true }).subscribe((e) => {
            const data = getData()
            const target = GetEventTarget(e)
            const targetValue = GetInputValue(target)

            if (data.labelElement.contains(target)) {
                data.optionElements.forEach(optionElement => SetInputValue(optionElement, targetValue))
                host.value = targetValue ? data.options : []
                data.labelElement.mixed = false
            } else {
                const selectedValues = data.optionElements.filter(GetInputValue).map(o => o.name)
                data.labelElement.value = selectedValues.length > 0
                data.labelElement.mixed = selectedValues.length !== data.options.length
                host.value = selectedValues
            }

            host.count = Math.random()
        })
    }
}

CreateComponent(FieldMultiselect)

export default FieldMultiselect
