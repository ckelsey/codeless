import IsItNull from "../checks/is-it-null"

export default function Remove(
    obj: any,
    path: string
) {
    if (!obj) { return obj }

    /** The search array, initial search item being the source */
    const pathParts = path.split('.')
    let result = obj

    const count = pathParts.length
    let loopIndex = pathParts.length

    while (loopIndex) {
        if (IsItNull(result)) { break }

        if (loopIndex == 1) {
            delete result[pathParts[count - loopIndex]]
            break
        }

        result = result[pathParts[count - loopIndex]]
        loopIndex = loopIndex - 1
    }

    return obj
}