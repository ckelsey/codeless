import IfInvalid from '../../utils/checks/if-invalid'
import IndexOf from '../../utils/checks/index-of'
import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import ToString from '../../utils/conversion/to-string'
import DispatchEvent from '../../utils/dom/dispatch-event'
import Pipe from '../../utils/function-helpers/pipe'
import EventObserver from '../../utils/observe/event-observer'
import WasClickedOn from '../../utils/dom/was-clicked-on'
import './style.scss'

const alignments = ['left', 'right']

const DropDown: ComponentArguments = {
    tag: 'drop-down',
    template: require('./index.html'),
    properties: {
        align: {
            format: Pipe(ToString, IndexOf(alignments), IfInvalid(alignments[0])),
            reflect: true
        }
    },
    slots: {
        item: { target: '.drop-down-items', multiple: true },
        label: { target: '.drop-down-label' }
    },
    elements: {
        itemsContainer: {
            selector: '.drop-down-items',
            onChange: (itemsContainer, host) => itemsContainer.events = {
                click: EventObserver(itemsContainer, 'click').subscribe((e: Event) => {
                    const clickedOnItem = WasClickedOn(itemsContainer.children, e)

                    if (!clickedOnItem) { return }

                    DispatchEvent(host, 'itemclicked', clickedOnItem)
                })
            }
        }
    }
}

CreateComponent(DropDown)

export default DropDown