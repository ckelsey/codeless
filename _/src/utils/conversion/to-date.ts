import Try from '../try'
import SetValid from './set-valid'

export default function ToDate(value: any): Date {
    if (value instanceof Date) { return SetValid(value, true) }

    const result: any = Try(() => new Date(Date.parse(value)))
    return SetValid(result, result !== 'Invalid Date' && !isNaN(result) && result instanceof Date)
}