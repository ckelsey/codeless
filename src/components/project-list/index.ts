import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import RemoveElement from '../../utils/dom/remove-element'
import ArrayFrom from '../../utils/conversion/array-from'
import EventObserver from '../../utils/observe/event-observer'
import Projects, { ProjectObject } from '../../services/projects'
import DateToObject, { DateObject } from '../../utils/conversion/date-to-object'
import IfInvalid from '../../utils/checks/if-invalid'
import '../new-project-overlay'
import './style.scss'

const linkClassname = 'project-link'

const ProjectsList: ComponentArguments = {
    tag: 'projects-list',
    template: require('./index.html'),
    elements: {
        itemsContainer: {
            selector: '.projects-list-items',
            onChange(el) {
                el.events = {
                    list: Projects.subscribeToList((items: ProjectObject[]) => {
                        ArrayFrom(el.children || []).forEach(RemoveElement)

                        items.forEach(item => {
                            const updatedDateObject: DateObject = Pipe(DateToObject, IfInvalid(DateToObject(new Date())))(item.updated)
                            const link = document.createElement('a')
                            link.className = `flex-between-center ${linkClassname}`
                            link.href = 'javascript:void(0)'
                            link.innerHTML = `<span class="mright-1">${item.name}</span><span class="translucent">${updatedDateObject.monthDouble}/${updatedDateObject.dayDouble}/${updatedDateObject.yearShort}</span>`
                            link.setAttribute('project-id', item.id)
                            el.appendChild(link)

                            const clickEvent = EventObserver(link, 'click')

                            if (clickEvent) {
                                (link as any).events = {
                                    click: clickEvent.subscribe(() => Projects.current = item.id)
                                }
                            }
                        })
                    }),

                    current: Projects.subscribeToCurrent(current =>
                        ArrayFrom(el.querySelectorAll(`.${linkClassname}`)).forEach(el =>
                            el.classList[el.getAttribute('project-id') === current.id ? 'add' : 'remove']('active-bg')
                        )
                    )
                }
            }
        },
        overlay: { selector: 'new-project-overlay' },
        newProjectBtn: {
            selector: '.new-project-btn',
            onChange(el, host) {
                const clickObserver = EventObserver(el, 'click')

                if (clickObserver) {
                    el.events = {
                        click: clickObserver.subscribe(() => (host.elements.overlay as any).setAttribute('shown', true))
                    }
                }
            }
        }
    }

}

CreateComponent(ProjectsList)

export default ProjectsList