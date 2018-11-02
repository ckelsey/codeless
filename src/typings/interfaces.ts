interface projectPage {
    name: string
    id: string
    data: Array<string>
}
interface projectData {
    pages: { [key: string]: projectPage }
    elements: { [key: string]: node }
    settings: {
        colors: string[]
        fonts: string[]
        name: string
        logo: string
        favicon: string
    }
    home: string
    navigation: any[]
    navigationMap: { [key: string]: string }
    // history: projectData[]
    // historyIndex: number
    currentPage: string
    templates: any
}
interface node {
    name: string
    id: string
    type: string
    content: any[]
    colSpan: number
    height: string
    index: { [key: string]: number }
    isRowStart?: boolean
    isRowEnd?: boolean
    background: string
    backgroundImage: string
    active: boolean
    published: boolean
    link?: string
    src?: string
    global: boolean
    css: string
    generic: any
}
interface dragDropData {
    dragIndex: number,
    dropIndex: number,
    group: string | undefined,
    event: Event
}