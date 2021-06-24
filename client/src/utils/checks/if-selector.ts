const queryCheck = (selector: string) => document.createDocumentFragment().querySelector(selector)

export default function IsSelector(selector: string) {
    try { queryCheck(selector) } catch { return false }
    return true
}