import SetValid from './set-valid'
import IsEmpty from '../types/is-empty'

function is(v: any) { return !!v }

export default function ToRegex(value: string) {

    if (IsEmpty(value)) {
        return SetValid(value, false)
    }

    if (typeof value.split !== 'function' && typeof value === 'object') {
        // already regex, clone
        return SetValid(new RegExp(value), true)

    }

    if (value.indexOf('/') === 0) {
        // regex that has been converted to string and needs to be prepared
        // split and make sure to remove empties(usually begining/end or if json escaped) for the join later
        const parts = value.split('/').filter(is)
        let options = parts.pop() || ''

        if (options.match(/[^gmisuy]/)) {
            // if anything other than standard flag, send back to regex
            parts.push(options)
            options = ''
        }

        return SetValid(new RegExp(parts.join('/'), options ? options : undefined), true)

    }

    return SetValid(new RegExp(value), true)
}