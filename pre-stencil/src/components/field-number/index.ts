import IfInvalid from '../../utils/checks/if-invalid'
import { ComponentArguments, ComponentElement } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import { AllInputProperties, FieldInputProperties } from '../../utils/component-builder/input-properties'
import InputElements from '../../utils/component-builder/input-elements'
import InputMethods from '../../utils/component-builder/input-methods'
import InputIconEvent from '../../utils/component-builder/input-icon-event'
import ToNumber from '../../utils/conversion/to-number'
import './style.scss'

const elements = InputElements()
const properties = Object.assign(
    {
        step: {
            format: Pipe(ToNumber, IfInvalid(0)),
            onChange(step: string, host: ComponentElement) {
                const input = host.elements.input
                if (!input) { return }
                input[step ? 'setAttribute' : 'removeAttribute']('step', step ? step : undefined)
            }
        }
    },
    AllInputProperties(),
    FieldInputProperties()
)

const FieldNumber: ComponentArguments = {
    tag: 'field-number',
    template: require('./index.html'),
    elements,
    properties,
    methods: InputMethods(),
    slots: { icon: { target: '.icon-container' }, },
    onConnected(host) { host.events = { slotChanged: InputIconEvent(host) } }
}

CreateComponent(FieldNumber)

export default FieldNumber