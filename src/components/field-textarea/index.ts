import IfInvalid from '../../utils/checks/if-invalid'
import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import ToString from '../../utils/conversion/to-string'
import Pipe from '../../utils/function-helpers/pipe'
import { AllInputProperties, FieldInputProperties } from '../../utils/component-builder/input-properties'
import InputElements from '../../utils/component-builder/input-elements'
import InputMethods from '../../utils/component-builder/input-methods'
import InputIconEvent from '../../utils/component-builder/input-icon-event'
import './style.scss'
import IndexOf from '../../utils/checks/index-of'

const resizeOptions = ['none', 'horizontal', 'vertical', 'both']
const elements = InputElements()
const properties = Object.assign(
    {
        resize: {
            format: Pipe(ToString, IndexOf(resizeOptions), IfInvalid(resizeOptions[0])),
            reflect: true
        },
    },
    AllInputProperties(),
    FieldInputProperties()
)

const FieldTextarea: ComponentArguments = {
    tag: 'field-textarea',
    template: require('./index.html'),
    elements,
    properties,
    methods: InputMethods(),
    slots: { icon: { target: '.icon-container' }, },
    onConnected(host) { host.events = { slotChanged: InputIconEvent(host) } }
}

CreateComponent(FieldTextarea)

export default FieldTextarea