/**
 * TODO
 * 
 * Properties
 *  - new
 * 
 * Elements
 *  - new
 * 
 * Methods
 *  - new
 * 
 * Slot
 *  - new
 * 
 * Template
 * - syntax highlighter
 * - dom viewer
 * - drag and drop components
 * - native dom drag and drop
 */

import { ComponentArguments } from '../../utils/component-builder/component'
import CreateComponent from '../../utils/component-builder/create'
import Components from '../../services/components'
import '../field-text'
import '../field-textarea'
import './style.scss'


const ComponentSettings: ComponentArguments = {
    tag: 'component-settings',
    template: require('./index.html'),
    elements: {
        tagInput: {
            selector: 'field-text[name="tag"]',
            onChange: el => el.events = {
                component: Components.subscribeToCurrent(component => el.value = component.tag)
            }
        },
        template: {
            selector: 'field-textarea[name="template"]',
            onChange: el => el.events = {
                component: Components.subscribeToCurrent(component => el.value = component.template)
            }
        }
    }
}

CreateComponent(ComponentSettings)
export default ComponentSettings