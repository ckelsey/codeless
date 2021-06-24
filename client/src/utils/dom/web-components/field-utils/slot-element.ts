import RemoveElement from '../../remove-element'
import Create, { CreateOptions } from '../../create'
import EventObserver from '../../../observe/event-observer'

function slottedElement(slotted: HTMLElement | Element | undefined, createOptions: CreateOptions) {
    return slotted ? slotted : Create(createOptions) as HTMLElement
}

function findSLottedAndRemoveOthers(el: HTMLElement, name: string, slotted?: Element | HTMLElement | undefined) {
    const slotteds = Array.from(el.querySelectorAll(`[slot="${name}"]`))

    if (!slotted) { slotted = slotteds.pop() }

    while (slotteds.length) {
        const currentSlotted = slotteds.pop() as Element | HTMLElement | undefined

        if (currentSlotted && currentSlotted !== slotted) {
            RemoveElement(currentSlotted)
        }
    }

    return slotted
}

export function getSlottedElement(el: HTMLElement, name: string, createOptions: CreateOptions, slotted?: HTMLElement) {
    return slottedElement(findSLottedAndRemoveOthers(el, name, slotted), createOptions)
}

export function getSlot(el: HTMLElement, name: string) {
    if (!el || !el.shadowRoot) { return }
    return el.shadowRoot.querySelector(`slot[name="${name}"]`)
}

export function slotEvent(el: any, slot: any, createOptions: CreateOptions) {
    if (!slot) { return }

    const name = slot.getAttribute('name')
    const eventName = `${name}SlotChange`

    if (slot && !el.events[eventName]) {
        el.events[eventName] = EventObserver(slot, 'slotchange', { noSubsComplete: false })
        el.events[eventName].subscribe(() => el.state[name].next(getSlottedElement(el, name, createOptions)))
    }
}