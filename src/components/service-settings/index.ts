import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Services from '../../services/services'
import Overlay from '../../behaviors/overlay'
import EventObserver from '../../utils/observe/event-observer'
import DispatchEvent from '../../utils/dom/dispatch-event'
import '../field-text'
import '../field-button'
import '../field-checkbox'
import '../field-select'
import '../field-multiselect'
import '../drop-down'
import '../editor-function'


const ServiceSettings: ComponentArguments = {
    tag: 'service-settings',
    template: require('./index.html'),
    elements: {
        name: {
            selector: 'field-text[name="name"]',
            onChange: el => el.events = {
                service: Services.subscribeToCurrent(service => el.value = service.name)
            }
        },
        btnAddPublicMethod: {
            selector: '#add-service-public-method',
            onChange(el, host) {
                el.events = {
                    click: EventObserver(el, 'click').subscribe(() => DispatchEvent(host, 'newmethod'))
                }
            }
        },
        functionEditor: {
            selector: 'editor-function',
            onChange(el, host) {
                el.overlay = Overlay(document.body, el, { scrim: true, widthbasis: 'page' })
                el.events = {
                    newProperty: EventObserver(host, 'newmethod').subscribe(() => {
                        el.fn = 'function sayHi(nameOfPerson:string, num:number){return `Hi ${name}! It\'s ${num} o\'clock`}'
                        el.overlay.show()
                    })
                }
            }
        }
    }
}

CreateComponent(ServiceSettings)
export default ServiceSettings