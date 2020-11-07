export default function SetCaret(el: HTMLElement, start: number) {
    const range = document.createRange()
    const sel = window.getSelection()

    if (!sel) { return el }

    range.setStart(el, start)
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)

    return el
}