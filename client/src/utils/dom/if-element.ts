export default function IfElement(root: ShadowRoot | HTMLElement | undefined | null, selector: string, then: (result: Element) => any = result => result, otherwise = () => { }) {
    if (!root || !selector) { return otherwise() }

    const element = root.querySelector(selector)

    return element ? then(element) : otherwise()
}