import Try from '../try'
import SetValid from './set-valid'

function ToJSONInternal(json: any, value: any) {
    return SetValid(json || value, !!json)
}

export default function ToJSON(value: any) {
    return ToJSONInternal(
        Try(() => JSON.stringify(value)),
        value
    )
}