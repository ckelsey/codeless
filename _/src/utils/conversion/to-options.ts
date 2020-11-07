import SetValid from "./set-valid"
import IsObject from "../types/is-object"
import Try from "../try"

export interface OptionsObject {
    [key: string]: any
    textContent: string
    value: string | number | boolean
}

export default function ToOptions(
    value: any,
    keyMap: { [key: string]: string } = { textContent: 'textContent', value: 'value' }
): OptionsObject[] {

    if (!Array.isArray(value)) {
        return SetValid(value, false)
    }

    const result = value
        .map((currentValue: any) => {
            if (typeof currentValue == 'string') {
                return { textContent: currentValue, value: currentValue }
            }

            if (IsObject(currentValue)) {
                const parsed: { [key: string]: string } = {}
                Object.keys(currentValue).forEach((key: string) => Try(parsed[keyMap[key] || key] = currentValue[key].toString()))
                return parsed
            }
        })
        .filter((currentObject) => !!currentObject)

    return SetValid(result, true)
}