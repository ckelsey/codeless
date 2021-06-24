import { ComponentArguments, ComponentElement } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Pipe from '../../utils/function-helpers/pipe'
import EventObserver from '../../utils/observe/event-observer'
import Overlay from '../../behaviors/overlay'
import ToBool from '../../utils/conversion/to-bool'
import IfInvalid from '../../utils/checks/if-invalid'
import '../field-text'
import './style.scss'
import Projects from '../../services/projects'

export interface NewProjectOverlayObject extends ComponentElement {
    shown: boolean
}

const NewProjectOverlay: ComponentArguments = {
    tag: 'new-project-overlay',
    template: require('./index.html'),
    properties: {
        shown: {
            nextOnNew: true,
            format: Pipe(ToBool, IfInvalid(false))
        }
    },
    elements: {
        root: {
            selector: '.new-project-overlay-container',
            onChange(el, host) {
                el.overlay = Overlay(host, el, { scrim: true, widthbasis: 'page' })
                requestAnimationFrame(() => host.setAttribute('ready', 'true'))
                el.events = {
                    shown: host.state.shown.subscribe((shown: boolean) => el.overlay[shown ? 'show' : 'hide']())
                }
            }
        },
        name: { selector: '#new-project-name' },
        form: {
            selector: '#new-project-form',
            onChange(el, _host) {
                const submitObserver = EventObserver(el, 'submit', { preventDefault: true })
                const host = _host as NewProjectOverlayObject

                if (submitObserver) {
                    el.events = {
                        submit: submitObserver.subscribe(() => {
                            const nameInput = host.elements.name as any
                            Projects.newProject(nameInput.value)
                            nameInput.value = ''
                            host.shown = false
                        })
                    }
                }
            }
        },
        newProjectCancel: {
            selector: '#new-project-cancel',
            onChange(el, _host) {
                const host = _host as NewProjectOverlayObject
                const clickObserver = EventObserver(el, 'click')

                if (clickObserver) {
                    el.events = {
                        click: clickObserver.subscribe(() => host.shown = false)
                    }
                }
            }
        }
    }
}

CreateComponent(NewProjectOverlay)

export default NewProjectOverlay