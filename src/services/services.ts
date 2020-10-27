import Observer from "../utils/observe/observer"

const current = Observer({}, { nextOnNew: true })
const list = Observer([], { nextOnNew: true })

export interface ServiceObject {
    name: string
    created: number
    updated: number
    id: string
}

const Services = {
    get() {
        return list.value
    },
    get current() { return current.value },
    set current(component) { current.next(component) },
    subscribeToCurrent: current.subscribe,

    get list() { return list.value },
    set list(arrayOfServices) { list.next(arrayOfServices) },
    subscribeToList: list.subscribe,

    newService(service: ServiceObject) {
        list.insert(service)
    }
}

export default Services