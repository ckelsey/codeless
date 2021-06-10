import Get from "../objects/get"

export default function GetInputValue(input: any) {
    if (!input) { return }

    const type = input.tagName.toLowerCase() === 'select' ? 'select' : input.type

    if (type === 'checkbox' || type === 'radio') {
        return input.checked
    }

    if (type === 'select') {
        return Get(input, `options.${Math.max(input.selectedIndex, 0)}.value`)
    }

    if (type === 'file') {
        return Array.from(input.files)
    }

    return input.value
}