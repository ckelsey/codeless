import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import { AllInputProperties } from '../../utils/component-builder/input-properties'
import InputElements from '../../utils/component-builder/input-elements'
import InputMethods from '../../utils/component-builder/input-methods'
import './style.scss'
import Pipe from '../../utils/function-helpers/pipe'
import ToBool from '../../utils/conversion/to-bool'
import IfInvalid from '../../utils/checks/if-invalid'

const methods = InputMethods()
const elements = InputElements()
const properties = Object.assign(
    {},
    AllInputProperties(),
    {
        mixed: {
            format: Pipe(ToBool, IfInvalid(false)),
            reflect: true
        }
    }
)

const FieldCheckbox: ComponentArguments = {
    tag: 'field-checkbox',
    template: require('./index.html'),
    elements,
    properties,
    methods
}

CreateComponent(FieldCheckbox)

export default FieldCheckbox
