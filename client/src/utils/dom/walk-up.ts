export default function WalkUp(parent: Node | HTMLElement | null, checkFn: (el: Node) => boolean) {
    let foundElement: undefined | HTMLElement | Node

    while (!foundElement && parent && parent !== document.body) {
        if (checkFn(parent)) {
            foundElement = parent
        }

        parent = parent.parentNode
    }

    return foundElement
}