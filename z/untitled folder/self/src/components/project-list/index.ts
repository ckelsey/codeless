import { ComponentArguments, ComponentElement, OverlayElement } from '../../component-builder/component'
import CreateComponent from '../../component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import ToFilter from '../../utils/conversion/to-filter'
import RemoveElement from '../../utils/dom/remove-element'
import ArrayFrom from '../../utils/conversion/array-from'
import Type from '../../utils/types/type'
import DOMReady from '../../utils/dom/ready'
import EventObserver from '../../utils/observe/event-observer'
import Projects from '../../services/projects'
import Overlay from '../../behaviors/overlay'

export interface ProjectsListElement extends ComponentElement {
    items?: string[]
}

export interface ProjectsListItem {
    name: string
}

const linkClassname = 'project-link'

const ProjectsList: ComponentArguments = {
    tag: 'projects-list',
    template: require('./index.html'),
    style: require('./style.scss').toString(),
    elements: {
        root: { selector: '.projects-list-container' },
        itemsContainer: { selector: '.projects-list-items' },
        items: {
            selector: `.${linkClassname}`,
            onChange(els: Element[], host: ComponentElement) {
                console.log(els)
            }
        },
        overlay: { selector: 'projects-links-overlay' },
        newProjectBtn: {
            selector: '.new-project-btn',
            onChange(el: OverlayElement, host: ComponentElement) {
                el.overlay = Overlay(host.elements.root, el)
                console.log(el.overlay)
                const clickObserver = EventObserver(el, 'click')
                el.events = {
                    click: clickObserver ?
                        clickObserver.subscribe(() => {
                            // Projects.newProject('Test')
                            console.log('click')
                            el.overlay.show()
                        }) :
                        () => { }
                }
            }
        }
    },
    properties: {
        list: {
            initialValue: [],
            nextOnNew: true,
            matchType: true,
            format: Pipe(ToFilter((item: { name: string }) => Type(item) == 'object' && !!item.name)),
            onChange(items: ProjectsListItem[], host: ComponentElement) {
                ArrayFrom(host.elements.itemsContainer.children || []).forEach(RemoveElement)

                items.forEach(item => {
                    const link = document.createElement('a')
                    link.className = linkClassname
                    link.href = 'javascript:void(0)'
                    link.textContent = item.name
                    host.elements.itemsContainer.appendChild(link)
                })

                host.elements.items = host.querySelectorAll('.project-link')
            }
        }
    }

}

DOMReady().then(() => CreateComponent(ProjectsList))

export default ProjectsList