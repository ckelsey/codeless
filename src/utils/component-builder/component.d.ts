export interface SlotObject {
    target: string
    multiple?: boolean
}

export interface SlotObjects {
    [key: string]: SlotObject
}

export interface ComponentArguments {
    tag: string
    template: string
    properties?: ComponentProperties
    elements?: ComponentElements
    slots?: SlotObjects
    methods?: { [key: string]: Function }
    onConnected?: (host: any) => void
    onDisconnected?: (host: any) => void
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

export interface ComponentElements {
    [key: string]: {
        selector: string
        onChange?: (el: any, host: any) => void
    }
}

export interface ComponentProperty {
    format?: (currentValue: any, host: any) => any
    onChange?: (currentValue: any, host: any) => void
    initialValue?: any
    nextOnNew?: boolean
    matchType?: boolean
    reflect?: boolean
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