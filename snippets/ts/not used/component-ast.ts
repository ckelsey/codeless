/**
 * TODO
 * - property initial value
 * - embed into component, ie. component.__metadata
 * - imports
 */

import ts from "typescript"
import Get from "../../../client/src/utils/objects/get.js"
import { getNodeTypeString } from "./typing.js"

interface ComponentAST {
    name: string
    properties: { [key: string]: Property }
    methods: { [key: string]: Method }
    imports: { [key: string]: any }
    description: string
}

interface Parameter {
    name: string
    type: string
    initial: any
    optional: boolean
    description: string
}

interface Method {
    name: string
    parameters: Parameter[]
    returnType: any
    description: string
}

interface Property {
    name: string
    type: string
    attribute: boolean
    description: string
}

type Properties = { [key: string]: { [key: string]: Property } }

function getText(node: any) { return node.getText().replace(/"|'/gm, '') }

function getDocs(el: any) {
    if (!el || !el.jsDoc) { return {} }

    const docs = el.jsDoc.reduce((results: any, doc: any) => {
        if (doc.comment) { results.description = doc.comment }

        if (doc.tags) {
            return Object.assign(
                {},
                results,
                doc.tags.reduce((tagsResults: any, tag: any) => {
                    const name = tag.tagName.escapedText

                    if (name === 'param') {
                        if (!tagsResults[name]) { tagsResults[name] = {} }
                        tagsResults[name][tag.name.escapedText] = tag.comment
                    } else {
                        tagsResults[name] = tag.comment
                    }

                    return tagsResults
                }, {})
            )
        }

        return results
    }, {})

    return docs
}

function getComponentName(node: ts.ClassDeclaration) {
    const name = node.name?.escapedText as string || ''
    return `${name.slice(0, 1).toLowerCase()}${name.slice(1).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`
}

function getMethodReturn(typeChecker: ts.TypeChecker, method: ts.MethodDeclaration) {
    const signature = typeChecker.getSignatureFromDeclaration(method)
    if (!signature) { return 'void' }
    return typeChecker.typeToString(signature.getReturnType())
}

function getNodeTypeFromSymbol(typeChecker: ts.TypeChecker, node: any) {
    const type = getNodeTypeString(typeChecker, node)

    if (type) { return type }

    const symbol = typeChecker.getTypeOfSymbolAtLocation(node.symbol, node.symbol.valueDeclaration)
    const string = typeChecker.typeToString(symbol)
    return string
}

function getParameters(typeChecker: ts.TypeChecker, params: ts.NodeArray<ts.ParameterDeclaration>, docs: any): Parameter[] {
    const result: Parameter[] = params.map(param => {
        const name = getText(param.name)
        return {
            name,
            type: getNodeTypeFromSymbol(typeChecker, param),
            initial: !!param.initializer ? getText(param.initializer) : undefined,
            optional: !!param.questionToken,
            description: docs?.param?.[name] || ''
        }
    })
    return result
}

function getMethod(typeChecker: ts.TypeChecker, member: ts.MethodDeclaration): Method {
    const name = getText(member.name)
    const docs = getDocs(member)
    return {
        name,
        parameters: getParameters(typeChecker, member.parameters, docs),
        returnType: getMethodReturn(typeChecker, member),
        description: docs.description || ''
    }
}

function isProperty(member: ts.Node) {
    return ts.isGetAccessor(member) || ts.isSetAccessor(member) || ts.isPropertyDeclaration(member)
}

function getProperty(typeChecker: ts.TypeChecker, member: any): Property {
    const docs = getDocs(member)

    return {
        name: getText(member.name),
        type: getNodeTypeFromSymbol(typeChecker, member),
        attribute: false,
        description: docs.description
    }
}

function processProperties(result: ComponentAST, properties: Properties) {
    Object.keys(properties).forEach((key: string) => {
        if (key === 'observedAttributes') { return }

        result.properties[key] = {
            name: key,
            type: Get(properties[key], 'declaration.type', 'any', (v: any) => !!v && v !== 'any' ? v : Get(properties[key], 'getAccessor.type', 'any')),
            attribute: !!properties[key].setAccessor,
            description: Get(properties[key], 'declaration.description', Get(properties[key], 'getAccessor.description', Get(properties[key], 'setAccessor.description'))),
        }
    })
}

function componentAST(typeChecker: ts.TypeChecker, node: ts.ClassDeclaration) {

    function visitMember(member: ts.ClassElement) {
        if (ts.isMethodDeclaration(member)) {
            const method = getMethod(typeChecker, member)
            result.methods[method.name] = method

        } else if (isProperty(member)) {
            const property = getProperty(typeChecker, member)
            if (!properties[property.name]) { properties[property.name] = {} }
            properties[property.name][ts.isGetAccessor(member) ? 'getAccessor' : ts.isSetAccessor(member) ? 'setAccessor' : 'declaration'] = property
        }
    }

    const properties: Properties = {}
    const result: ComponentAST = {
        name: getComponentName(node),
        properties: {},
        methods: {},
        imports: {},
        description: getDocs(node).description || ''
    }

    node.members.forEach(visitMember)
    processProperties(result, properties)

    return result
}

export default componentAST