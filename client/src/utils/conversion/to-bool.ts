import SetValid from './set-valid'

const falses = ['0', 0, 'off', 'false', false]
const trues = ['1', 1, 'on', 'true', true]

export default function ToBool(value: any) {
    const isTrue = trues.indexOf(value) > -1
    const isFalse = falses.indexOf(value) > -1
    return SetValid(isTrue ? true : false, isTrue || isFalse)
}