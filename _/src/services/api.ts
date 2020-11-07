import Try from '../utils/try'
import Pipe from '../utils/function-helpers/pipe'
import ToJSON from '../utils/conversion/to-json'
import ToBool from '../utils/conversion/to-bool'
import IfInvalid from '../utils/checks/if-invalid'

export interface APIOptions {
    data?: string | { [key: string]: any } | any[]
    headers?: { [key: string]: string }
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    withCredentials?: boolean
    form?: boolean
}

export interface APIXHROptions {
    data?: string
    headers: { [key: string]: string }
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    credentials: boolean
    url: string
}

const apiDomain = 'http://localhost:4915'

const getHeaders = (options: APIOptions) => {
    const headers = Object.assign({}, { 'X-Requested-With': 'XMLHttpRequest' }, options.headers || {})

    if (options.form) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    } else {
        headers['Content-Type'] = 'application/json;charset=UTF-8'
    }

    return headers
}

const isForm = (data: any) => data instanceof FormData

const getData = (data: any) => isForm(data) || typeof data === 'string' || typeof data === 'undefined' ?
    data :
    Pipe(ToJSON, IfInvalid(null))(data)

function runXHR(options: APIXHROptions) {
    return new Promise((resolve: (value: APIResult) => void, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(options.method, options.url, true)

        const finish = () => {
            const response: APIResult = Try(() => JSON.parse(xhr.responseText)) || xhr.responseText
            return xhr.status !== 200 ? reject(response) : resolve(response)
        }

        Object.keys(options.headers)
            .forEach(key => xhr.setRequestHeader(key, options.headers[key]))

        xhr.withCredentials = options.credentials
        xhr.onload = finish
        xhr.onerror = finish
        xhr.send(options.data)
    })
}

async function API(path = '/', options: APIOptions = {}) {
    const params = {
        data: getData(options.data),
        headers: getHeaders(options),
        method: options.method || 'GET',
        credentials: Pipe(ToBool, IfInvalid(false))(options.withCredentials),
        url: `${apiDomain}${path}`
    }

    return runXHR(params)
}

export interface APIResult {
    success: boolean
    result: any
}

export default API