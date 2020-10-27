import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import './style.scss'
import '../field-checkbox'
import Pipe from '../../utils/function-helpers/pipe'
import ValidateHtml from '../../utils/validate/html'
import IfInvalid from '../../utils/checks/if-invalid'
import ToString from '../../utils/conversion/to-string'
import ToArray from '../../utils/conversion/to-array'
import CommasToArray from '../../utils/conversion/commas-to-array'
import ToOptions, { OptionsObject } from '../../utils/conversion/to-options'
// import Create from '../../utils/dom/create'
// import RemoveChildren from '../../utils/dom/remove-children'
import '../drop-down'
import ArrayFrom from '../../utils/conversion/array-from'

const FieldMultiselect: ComponentArguments = {
    tag: 'field-multiselect',
    template: require('./index.html'),
    properties: {
        label: {
            format: Pipe(
                ToString,
                IfInvalid(''),
                (value: string) => ValidateHtml(value).sanitized
            )
        },
        value: {},
        options: { format: Pipe(ToArray, CommasToArray, ToOptions) }
    },
    elements: {
        dropdownLabel: {
            selector: '.field-multiselect-label',
            onChange(el, host) {
                el.events = {
                    label: host.state.label.subscribe((label: string) => {
                        // const labelCheckbox = Create({
                        //     tag: 'field-checkbox',
                        //     properties: {
                        //         label
                        //     }
                        // })

                        // RemoveChildren(el)
                        // el.appendChild(labelCheckbox)

                        // const optionEl = document.createElement('field-checkbox') as any
                        // optionEl.label = label
                        // el.appendChild(optionEl)

                        el.label = label
                    })
                }
            }
        },
        dropdown: {
            selector: '.field-multiselect-dropdown',
            onChange(el, host) {
                el.events = {
                    options: host.state.options.subscribe((options: OptionsObject[]) => {
                        ArrayFrom(el.querySelectorAll('[slot-ref="item"]')).forEach(item => el.removeChild(item))

                        options.forEach(option => {
                            const optionEl = document.createElement('field-checkbox') as any
                            optionEl.setAttribute('slot-ref', 'item')
                            optionEl.label = option.textContent
                            optionEl.name = option.value
                            el.appendChild(optionEl)
                            // el.appendChild(Create({
                            //     tag: 'field-checkbox',
                            //     properties: {
                            //         label: option.textContent,
                            //         name: option.value as any,
                            //     },
                            //     attributes: {
                            //         'slot-ref': 'item'
                            //     }
                            // }))
                        })
                    })
                }
            }
        }
    },
    onConnected(host) {
        host.setAttribute('ready', true)
    }
}

CreateComponent(FieldMultiselect)

export default FieldMultiselect
