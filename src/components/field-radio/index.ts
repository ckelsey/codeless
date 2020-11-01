import { ComponentArguments, ComponentElement } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import { AllInputProperties } from '../../utils/component-builder/input-properties'
import { helpTextElement, inputId } from '../../utils/component-builder/input-elements'
import InputMethods from '../../utils/component-builder/input-methods'
import InputIconEvent from '../../utils/component-builder/input-icon-event'
import './style.scss'
import Pipe from '../../utils/function-helpers/pipe'
import ToArray from '../../utils/conversion/to-array'
import CommasToArray from '../../utils/conversion/commas-to-array'
import ToOptions, { OptionsObject } from '../../utils/conversion/to-options'
import IfInvalid from '../../utils/checks/if-invalid'
import Get from '../../utils/objects/get'
import Set from '../../utils/objects/set'
import RemoveChildren from '../../utils/dom/remove-children'
import Create from '../../utils/dom/create'
import ID from '../../utils/id'
import ValidateHtml from '../../utils/validate/html'

const properties = Object.assign(
    {},
    AllInputProperties(),
    {
        options: {
            format: Pipe(ToArray, CommasToArray, ToOptions, IfInvalid([])),
            onChange(options: OptionsObject[], host: ComponentElement) {
                const currentVal = Get(host, 'value')
                const valToSet = !!currentVal ? currentVal : Get(options, '0.value', '')
                Set(host, 'value', valToSet)
            }
        }
    }
)

const FieldRadio: ComponentArguments = {
    tag: 'field-radio',
    template: require('./index.html'),
    elements: {
        helptext: helpTextElement,
        input: {
            selector: 'input[type="radio"]'
        },
        mainLabel: {
            selector: '.field-radio-main-label',
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
        },
        inputsContainer: {
            selector: '.field-radio-inputs',
            onChange(el, host) {
                el.events = {
                    options: host.state.options.subscribe((options: OptionsObject[]) => {
                        RemoveChildren(el)
                        options.forEach(option => {
                            const id = ID()
                            el.appendChild(Create({
                                tag: 'div',
                                attributes: {
                                    class: 'field-radio-option-container'
                                },
                                children: [
                                    Create({
                                        tag: 'input',
                                        attributes: {
                                            class: 'field-radio-option',
                                            type: 'radio',
                                            id: inputId(id),
                                            name: host.name || inputId(host.componentId),
                                            value: option.value as any
                                        }
                                    }) as HTMLElement,
                                    Create({
                                        tag: 'label',
                                        attributes: {
                                            class: 'field-radio-option-label',
                                            for: inputId(id)
                                        },
                                        properties: {
                                            innerHTML: ValidateHtml(option.textContent).sanitized
                                        }
                                    }) as HTMLElement
                                ]
                            }))
                        })
                    })
                }
            }
        }
    },
    properties,
    methods: InputMethods(),
    slots: { icon: { target: '.icon-container' }, },
    onConnected(host) { host.events = { slotChanged: InputIconEvent(host) } }
}

CreateComponent(FieldRadio)

export default FieldRadio