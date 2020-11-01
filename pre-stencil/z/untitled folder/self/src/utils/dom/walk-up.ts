export default function WalkUp(parent: Node | Element | null, checkFn: (el: Node) => boolean) {
    let link

    while (!link && parent && parent !== document.body) {
        if (checkFn(parent)) {
            link = parent
        }

        parent = parent.parentNode
    }

    return link
}