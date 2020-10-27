import { ComponentArguments, ComponentElement } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import { AllInputProperties } from '../../utils/component-builder/input-properties'
import InputElements from '../../utils/component-builder/input-elements'
import InputMethods from '../../utils/component-builder/input-methods'
import InputIconEvent from '../../utils/component-builder/input-icon-event'
import Pipe from '../../utils/function-helpers/pipe'
import ToArray from '../../utils/conversion/to-array'
import CommasToArray from '../../utils/conversion/commas-to-array'
import ToOptions, { OptionsObject } from '../../utils/conversion/to-options'
import IfInvalid from '../../utils/checks/if-invalid'
import './style.scss'
import RemoveChildren from '../../utils/dom/remove-children'
import Create from '../../utils/dom/create'
import Get from '../../utils/objects/get'
import Set from '../../utils/objects/set'

const elements = Object.assign(
    {},
    InputElements(),
    {
        select: {
            selector: 'select',
            onChange(el: ComponentElement, host: ComponentElement) {
                el.events = {
                    options: host.state.options.subscribe((options: OptionsObject[]) => {
                        RemoveChildren(el)
                        options.forEach(properties => {
                            const option = Create({ tag: 'option', properties })
                            if (option) { el.appendChild(option) }
                        })
                    })
                }
            }
        }
    }
)
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

const FieldSelect: ComponentArguments = {
    tag: 'field-select',
    template: require('./index.html'),
    elements,
    properties,
    methods: InputMethods(),
    slots: { icon: { target: '.icon-container' }, },
    onConnected(host) { host.events = { slotChanged: InputIconEvent(host) } }
}

CreateComponent(FieldSelect)

export default FieldSelect