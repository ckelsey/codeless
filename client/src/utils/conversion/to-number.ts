import SetValid from './set-valid'

export default function ToNumber(value: any) {
    const result = Number(value)
    const isNumber = !isNaN(result)
    return SetValid(isNumber ? result : value, isNumber)
}