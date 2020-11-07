import Pipe from '../function-helpers/pipe'
import SetValid from './set-valid'
import Try from '../try'

function respond(value: any) {
    return SetValid(value, Array.isArray(value))
}

function CommasToArraySplit(value: any) {
    return Try(() => value.split(',').map((v: string) => v.trim())) || value
}

export default function CommasToArray(value: any) {
    return Array.isArray(value) ? SetValid(value, true) : Pipe(CommasToArraySplit, respond)(value)
}