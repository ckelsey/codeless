import ArrayFrom from "../conversion/array-from"

export default function IfElements(root: ShadowRoot | HTMLElement | undefined | null, selector: string, then: (result: [Element]) => any = result => result, otherwise = () => { }) {
    if (!root || !selector) { return otherwise() }

    const elements = ArrayFrom(root.querySelectorAll(selector)) as [Element]

    if (!elements.length) {
        return otherwise()
    } else {
        then(elements)
    }
}