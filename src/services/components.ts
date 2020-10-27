import FlashMessage from "../components/flash-message"
import FieldText from "../components/field-text"
import Observer from "../utils/observe/observer"

const current = Observer(undefined, { nextOnNew: true })

const defaultComponents = [
    FieldText,
    FlashMessage
]

const Components = {
    get current() { return current.value },
    set current(component) { current.next(component) },
    subscribeToCurrent: current.subscribe,

    defaultComponents
}

Components.current = defaultComponents[0]

export default Components