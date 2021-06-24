import SetValid from './set-valid'
import Try from '../try'

export default function ToString(value: any) {
    function ToStringInternal(str: any) {
        return SetValid(str, typeof str == 'string')
    }

    return ToStringInternal(Try(() => value.toString()))
}