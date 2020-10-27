import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import ArrayFrom from '../../utils/conversion/array-from'
import EventObserver from '../../utils/observe/event-observer'
import DateToObject, { DateObject } from '../../utils/conversion/date-to-object'
import IfInvalid from '../../utils/checks/if-invalid'
import Services, { ServiceObject } from '../../services/services'
import RemoveChildren from '../../utils/dom/remove-children'

const linkClassname = 'service-link'

const ServicesList: ComponentArguments = {
    tag: 'services-list',
    template: require('./index.html'),
    elements: {
        itemsContainer: {
            selector: '.services-list-items',
            onChange(el) {
                el.events = {
                    list: Services.subscribeToList((items: ServiceObject[]) => {
                        RemoveChildren(el)

                        items.forEach(item => {
                            const updatedDateObject: DateObject = Pipe(DateToObject, IfInvalid(DateToObject(new Date())))(item.updated)
                            const link = document.createElement('a')
                            link.className = `flex-between-center ${linkClassname}`
                            link.href = 'javascript:void(0)'
                            link.innerHTML = `<span class="mright-1">${item.name}</span><span class="translucent">${updatedDateObject.monthDouble}/${updatedDateObject.dayDouble}/${updatedDateObject.yearShort}</span>`
                            link.setAttribute('service-id', item.id)
                            el.appendChild(link)

                            const clickEvent = EventObserver(link, 'click')

                            if (clickEvent) {
                                (link as any).events = {
                                    click: clickEvent.subscribe(() => Services.current = item.id)
                                }
                            }
                        })
                    }),

                    current: Services.subscribeToCurrent(current =>
                        ArrayFrom(el.querySelectorAll(`.${linkClassname}`)).forEach(el =>
                            el.classList[el.getAttribute('service-id') === current.id ? 'add' : 'remove']('active-bg')
                        )
                    )
                }
            }
        },
        newServiceBtn: {
            selector: '.new-service-btn',
            onChange(el) {
                const clickObserver = EventObserver(el, 'click')

                if (clickObserver) {
                    el.events = {
                        click: clickObserver.subscribe(() => Services.current = {})
                    }
                }
            }
        }
    }

}

CreateComponent(ServicesList)

export default ServicesList