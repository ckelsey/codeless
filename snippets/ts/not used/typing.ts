import ts from "typescript"
import Get from "../../../client/src/utils/objects/get.js"

function intrinsic(node: any) { return Get(node, 'intrinsicName') }

function ignoreSymbol(name: string) { return name === 'Element' || (name.startsWith('HTML') && name.endsWith('Element')) }

function getArrayString(typeChecker: ts.TypeChecker, node: any) { return `${node.resolvedTypeArguments.map((type: any) => getTypeObjectString(typeChecker, type)).join(' | ')}[]` }

function isArrayType(typeObject: any) { return Get(typeObject, 'symbol.escapedName') === 'Array' && !!typeObject.resolvedTypeArguments }

function getMembersString(typeChecker: ts.TypeChecker, members: any) {
    const results: string[] = []

    members.forEach((member: any) => {
        const symbol = Get(member, 'valueDeclaration.symbol', Get(member, 'symbol', member))
        const symbolType = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
        results.push(`${member.escapedName}: ${getTypeObjectString(typeChecker, symbolType)}`)
    })

    return results
}

function getSymbolString(typeChecker: ts.TypeChecker, symbol: any): any {
    const name = symbol.escapedName

    if (ignoreSymbol(name)) { return name }

    if (symbol.members) { return `${name} { ${getMembersString(typeChecker, symbol.members).join(', ')} }` }

    // console.log('getSymbolString==xxxxxxxxxxx', symbol)
}

function getTypeObjectString(typeChecker: ts.TypeChecker, typeObject: any) {
    const name = intrinsic(typeObject)

    if (name && !typeObject.types) { // basic primitive

        return name

    } else if (typeObject.types) { // unions

        return getUnionString(typeChecker, typeObject.types)

    } else if (isArrayType(typeObject)) { // Array

        return getArrayString(typeChecker, typeObject)

    }

    // console.log('getTypeObjectString==xxxxxxxxx', typeObject)
}

export function getNodeType(typeChecker: ts.TypeChecker, node: ts.Node) { return typeChecker.getTypeAtLocation(node) }

export function getUnionString(typeChecker: ts.TypeChecker, types: any[]) {
    return types
        .map(type => {
            const name = intrinsic(type)
            if (name) { return name }

            if (type.symbol) { return getSymbolString(typeChecker, type.symbol) }

            if (type.value) { return `'${type.value}'` }

            // console.log('getUnionString==xxxxxxxxx', type)
        })
        .join(' | ')
}

export function getNodeTypeString(typeChecker: ts.TypeChecker, node: ts.Node) { return getTypeObjectString(typeChecker, getNodeType(typeChecker, node)) }