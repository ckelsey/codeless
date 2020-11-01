import SetValid, { IsValid } from './set-valid'
import FromJSON from './from-json'
import IsObject from '../types/is-object'

export default function ToObject(value: any) {
    if (typeof value == 'string') {
        const result = FromJSON(value)

        if (IsValid(result) && IsObject(result)) {
            return result
        }
    }

    return SetValid(value, IsObject(value))
}