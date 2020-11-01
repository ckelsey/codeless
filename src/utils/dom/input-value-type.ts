import Get from "../objects/get"

export default function InputValueType(input: any) {
    let valueType = 'string'

    if (input) {
        const tag = Get(input, 'tagName.toLowerCase()', '')
        const type = Get(input, 'type')

        if (tag == 'input') {
            if (type == 'number') {
                valueType = 'number'
            }

            if (type == 'checkbox') {
                valueType = 'bool'
            }
        }

        if (tag == 'select') {
            valueType = 'any'
        }
    }

    return valueType
}