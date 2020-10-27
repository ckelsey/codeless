import { ComponentElement } from '../component-builder/component'
import EventObserver from '../observe/event-observer'
import Get from '../objects/get'

export default function InputIconEvent(host: ComponentElement) {
    return EventObserver(host, 'slotchanged').subscribe((e: Event) => {
        const icon = Get(e, 'detail.element')
        const setting = icon ? 'true' : undefined as any
        host[icon ? 'setAttribute' : 'removeAttribute']('hasicon', setting)
    })
}