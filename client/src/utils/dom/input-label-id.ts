import SetAttribute from "./set-attribute"

export default function InputLabelId(id: string, input: HTMLInputElement, label: HTMLElement) {
    SetAttribute(input, 'id', id)
    SetAttribute(label, 'for', id)
}