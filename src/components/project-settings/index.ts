import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import EventObserver from '../../utils/observe/event-observer'
import Projects from '../../services/projects'
import Get from '../../utils/objects/get'
import '../field-text'
import '../flash-message'
import '../flash-message'

const ProjectSettings: ComponentArguments = {
    tag: 'project-settings',
    template: require('./index.html'),
    elements: {
        flashMessage: { selector: 'flash-message' },
        form: {
            selector: 'form',
            onChange(el, _host) {
                const submitObserver = EventObserver(el, 'submit', { preventDefault: true })
                const host = _host
                const nameInput = host.elements.name as any

                if (submitObserver) {
                    el.events = {
                        submit: submitObserver.subscribe(() => {
                            Projects.saveProject({
                                name: nameInput.value,
                                id: Get(Projects, 'current.id')
                            })
                        })
                    }
                }
            }
        },
        name: {
            selector: 'field-text[name="project-name"]',
            onChange(el) {
                el.events = {
                    current: Projects.subscribeToCurrent(current => (el as any).value = Get(current, 'name'))
                }
            }
        },
        deleteBtn: {
            selector: '.delete-btn',
            onChange(el, host) {
                const clickObserver = EventObserver(el, 'click')

                if (clickObserver) {
                    el.events = {
                        click: clickObserver.subscribe(() => host.elements.flashMessage.shown = true)
                    }
                }
            }
        },
        deleteConfirmBtn: {
            selector: '.delete-confirmed-btn',
            onChange(el, host) {
                const deleteClickObserver = EventObserver(el, 'click')
                if (deleteClickObserver) {
                    el.events = {
                        click: deleteClickObserver.subscribe(() => {
                            Projects.deleteProject(Get(Projects, 'current.id'))
                                .then(() => host.elements.flashMessage.shown = false)
                        })
                    }
                }
            }
        },
        cancelBtn: {
            selector: '.delete-cancel-btn',
            onChange(el, host) {
                const cancelClickObserver = EventObserver(el, 'click')
                if (cancelClickObserver) {
                    el.events = {
                        click: cancelClickObserver.subscribe(() => host.elements.flashMessage.shown = false)
                    }
                }
            }
        },
        deleteMsg: {
            selector: '[slot-ref="body"]',
            onChange: (el) => el.events = {
                project: Projects.subscribeToCurrent(current => el.textContent = `Are you want to delete ${current.name}?`)
            }

        }
    }

}

CreateComponent(ProjectSettings)

export default ProjectSettings