import IfInvalid from '../../utils/checks/if-invalid'
import IndexOf from '../../utils/checks/index-of'
import { ComponentArguments, ComponentElement } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import Get from '../../utils/objects/get'
import { AllInputProperties, FieldInputProperties } from '../../utils/component-builder/input-properties'
import InputElements from '../../utils/component-builder/input-elements'
import InputMethods from '../../utils/component-builder/input-methods'
import InputIconEvent from '../../utils/component-builder/input-icon-event'
import './style.scss'

const types = ['text', 'email', 'tel']
const elements = InputElements()
const properties = Object.assign(
    {
        type: {
            format: (type: any, host: ComponentElement) => Pipe(IndexOf(types), IfInvalid(Get(host, 'value', types[0])))(type),
            // onChange: (type: any, host: ComponentElement) => (host.elements.input as HTMLElement).setAttribute('type', type)
        }
    },
    AllInputProperties(),
    FieldInputProperties()
)

const FieldText: ComponentArguments = {
    tag: 'field-text',
    template: require('./index.html'),
    elements,
    properties,
    methods: InputMethods(),
    slots: { icon: { target: '.icon-container' }, },
    onConnected(host) { host.events = { slotChanged: InputIconEvent(host) } }
}

CreateComponent(FieldText)

export default FieldText