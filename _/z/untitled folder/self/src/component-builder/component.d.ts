import { OverlayObject } from "../behaviors/overlay";

export interface ComponentArguments {
    tag: string
    template: string
    style?: string
    properties?: { [key: string]: any }
    elements?: { [key: string]: any }
    methods?: { [key: string]: any }
    onConnected?: (host: ComponentElement) => void
    onDisconnected?: (host: ComponentElement) => void
}

export interface ComponentElement extends HTMLElement {
    onConnected: (v: ComponentElement) => void
    onDisconnected: (v: ComponentElement) => void
    events?: { [key: string]: any }
    state: { [key: string]: any }
    elements: { [key: string]: any }
    properties: { [key: string]: any }
    hasConnected: boolean
    exists$?: any
    create: any
    constructed: boolean
    componentId: string
    nodeObserver?: MutationObserver
    tag: string
}

export interface OverlayElement extends ComponentElement {
    overlay: OverlayObject
}

export interface ComponentElements {
    [key: string]: {
        selector: string
        onChange?: (el: Element, host: ComponentElement) => void
    }
}

export interface ComponentProperty {
    format?: (currentValue: any, host: ComponentElement) => any
    onChange?: (currentValue: any, host: ComponentElement) => void
    initialValue?: any
    nextOnNew?: boolean
    matchType?: boolean
}

export interface ComponentProperties {
    [key: string]: ComponentProperty
}

export interface ComponentState {
    [key: string]: {
        get: any
        set: (newValue: any) => void
    }
}