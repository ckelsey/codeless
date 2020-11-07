import Try from '../try'
import SetValid from './set-valid'

export default function FromUriComponent(value: string) {
    return Try(() => SetValid(decodeURIComponent(value), true)) || SetValid(value, false)
}