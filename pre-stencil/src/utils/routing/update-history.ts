import queryObjectToString from './query-object-to-string'

function formatPath(path: string = '') {
    return path[0] == '/' ? path : `/${path}`
}

function fullUrl(path: string, query: { [key: string]: string } = {}) {
    return `${location.protocol}//${location.host}${formatPath(path)}${queryObjectToString(query)}`
}

export default function UpdateHistory(
    path: string = '/',
    query: { [key: string]: string } = {},
    replace: boolean = false
) {
    const full = fullUrl(path, query)

    if (replace && history.replaceState) {
        history.replaceState({}, document.title, full)
    }

    if (!replace && history.pushState) {
        history.pushState({}, document.title, full)
    }
}