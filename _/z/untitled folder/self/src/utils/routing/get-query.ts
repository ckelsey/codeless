function invalidQuery(searchString: string) {
    return !searchString || typeof searchString.split !== 'function' || searchString === ''
}

function getQuery(url: string = location.search || '') {
    const result: { [key: string]: string } = {}
    let searchString = url.slice()

    if (invalidQuery(searchString)) { return result }

    const queryString = searchString.indexOf('?') > -1 ? searchString.split('?')[1] : searchString

    if (invalidQuery(queryString)) { return result }

    function queryEach(v: string) {
        if (!v || typeof v.split !== 'function') { return }
        result[v.split('=')[0]] = v.split('=')[1]
    }

    queryString.split('&').forEach(queryEach)

    return result
}

export default getQuery