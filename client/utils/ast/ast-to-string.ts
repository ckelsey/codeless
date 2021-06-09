import { FunctionData, FunctionParameters, FunctionStatement } from './function-reader'
import Type from '../types/type'
import FromJSON from '../conversion/from-json'
import { IsValid } from '../conversion/set-valid'

function addComma(index) { return index ? ', ' : '' }

function setToString(statement: FunctionStatement) {
    return `${statement.subject} = ${statement.value.map(value => value.value).join(' ')};\n`
}

function defaultToString(defaultValue) {
    let type = Type(defaultValue)

    if (type === 'string') {
        const possibleObject = FromJSON(defaultValue)

        if (IsValid(possibleObject)) {
            type = 'object'
        }
    }

    return defaultValue === undefined ?
        '' :
        type === 'string' && defaultValue !== 'null' ?
            `='${defaultValue}'` :
            `=${defaultValue}`

}

function parametersToString(parameters: FunctionParameters[] = []) {
    return parameters.reduce((result, current, index) =>
        !current || !current.name
            ? result
            : `${result}${addComma(index)}${current.name}${defaultToString(current.defaultValue)}`, ''
    )
}

export default function AstToString(data: FunctionData) {
    // const imports = data.imports
    // const { imports =[], name = '', parameters = [], body = [] } = data
    const name = data.name || ''
    const parameters = data.parameters || []
    const body = data.body || []

    return `function ${name}(${parametersToString(parameters)}){ \n${body.map(statement => statement.action === 'set' ? setToString(statement) : '')} }`
}