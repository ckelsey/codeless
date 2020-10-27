import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import ToString from '../../utils/conversion/to-string'
import ToBool from '../../utils/conversion/to-bool'
import IfInvalid from '../../utils/checks/if-invalid'
import Pipe from '../../utils/function-helpers/pipe'
import './style.scss'
import IndexOf from '../../utils/checks/index-of'

const FieldButton: ComponentArguments = {
    tag: 'field-button',
    template: require('./index.html'),
    properties: {
        type: { format: Pipe(ToString, IfInvalid('')) },
        disabled: {
            format: Pipe(ToBool, IfInvalid(false)),
            reflect: true
        },
        spinner: {
            format: Pipe(ToBool, IfInvalid(false)),
            reflect: true
        },
        theme: {
            format: Pipe(ToString, IndexOf(['danger', 'warning', 'secondary']), IfInvalid('')),
            reflect: true
        },
        size: {
            format: Pipe(ToString, IndexOf(['big', 'small']), IfInvalid('')),
            reflect: true
        },
        kind: {
            format: Pipe(ToString, IndexOf(['link']), IfInvalid('')),
            reflect: true
        },
    },
    slots: {
        content: { target: '.field-button-container > button' }
    },
    elements: {
        button: {
            selector: 'button',
            onChange(el, host) {
                el.events = {
                    type: host.state.type.subscribe((type: string) => el[!!type ? 'setAttribute' : 'removeAttribute']('type', !!type ? type : undefined)),
                    disabled: host.state.disabled.subscribe((disabled: boolean) => el[!!disabled ? 'setAttribute' : 'removeAttribute']('disabled', !!disabled ? true : undefined)),
                }
            }
        }
    }
}

CreateComponent(FieldButton)

export default FieldButton
