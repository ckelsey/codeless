import { ComponentArguments, ComponentElement } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import ToBool from '../../utils/conversion/to-bool'
import IfInvalid from '../../utils/checks/if-invalid'
import Overlay from '../../behaviors/overlay'
import ToString from '../../utils/conversion/to-string'
import IndexOf from '../../utils/checks/index-of'

export interface FlashMessageElement extends ComponentElement {
    shown: boolean
    overlay: typeof Overlay
}

const FlashMessage: ComponentArguments = {
    tag: 'flash-message',
    template: require('./index.html'),
    slots: {
        header: { target: '.flash-message-header' },
        body: { target: '.flash-message-body' },
        footer: { target: '.flash-message-footer' },
    },
    elements: {
        root: {
            selector: '.flash-message-container',
            onChange: (el, host) => el.events = {
                type: host.state.type.subscribe((type: string) => el.setAttribute('type', type))
            }
        }
    },
    properties: {
        shown: {
            format: Pipe(ToBool, IfInvalid(false))
        },
        type: {
            format: Pipe(ToString, IndexOf(['danger', 'warning', 'success', 'info']), IfInvalid('info'))
        }
    },
    onConnected(host) {
        host.overlay = Overlay(document.body as any, host, { scrim: true, widthbasis: 'page' })
        host.events = {
            shown: host.state.shown.subscribe((shown: boolean) => host.overlay[shown ? 'show' : 'hide']())
        }
    }
}

CreateComponent(FlashMessage)

export default FlashMessage