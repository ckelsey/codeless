import path from "path"
import ts from "typescript"
import Config from "./config.js"

interface ImportSchema {
    name?: string
    names?: string[]
    from: string
}

interface TypeSchema {
    name: string
    properties: TypePropertySchema[]
}

interface TypePropertySchema {
    name: string
    type: string
}

interface ParameterSchema {
    name: string
    type: string
    optional?: boolean
}

interface MethodSchema {
    name: string
    returns: string
    parameters: ParameterSchema
}

interface PropertySchema {
    name: string
    type: string
    readonly?: boolean
}

interface ClassSchema {
    name: string
    methods: { [key: string]: MethodSchema }
    properties: { [key: string]: PropertySchema },
    description?: string
}

const root = path.resolve('')

function isNodeExported(node: ts.Node): boolean {
    return ((ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile))
}

function getDocs(el: any): any {
    if (!el) { return {} }

    if (!el.jsDoc && el.original) { return getDocs(el.original) }

    if (!el.jsDoc) { return {} }

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

function getNodeTypeFromSymbol(typeChecker: ts.TypeChecker, node: any) {
    const _symbol = node.symbol || node.original.symbol
    const symbol = typeChecker.getTypeOfSymbolAtLocation(_symbol, _symbol.valueDeclaration)
    const string = typeChecker.typeToString(symbol)
    return string
}

function kindToText(kind: number) {
    if (kind === ts.SyntaxKind.NullKeyword) { return 'null' }
    if (kind === ts.SyntaxKind.BooleanKeyword) { return 'boolean' }
    if (kind === ts.SyntaxKind.TrueKeyword) { return 'true' }
    if (kind === ts.SyntaxKind.FalseKeyword) { return 'false' }
    if (kind === ts.SyntaxKind.StringKeyword) { return 'string' }
    if (kind === ts.SyntaxKind.VoidKeyword) { return 'void' }
    if (kind === ts.SyntaxKind.UndefinedKeyword) { return 'undefined' }
    if (kind === ts.SyntaxKind.FunctionKeyword) { return 'function' }
    if (kind === ts.SyntaxKind.SymbolKeyword) { return 'symbol' }
    if (kind === ts.SyntaxKind.ObjectKeyword) { return 'object' }
    if (kind === ts.SyntaxKind.NumberKeyword) { return 'number' }
    if (kind === ts.SyntaxKind.BigIntKeyword) { return 'bigint' }
}

function typeToString(typeChecker: ts.TypeChecker, type: any): string {
    if (type.members) {
        const members = type.members.map((member: any) => `{[${member.parameters[0].name.escapedText}: ${typeToString(typeChecker, member.parameters[0].type)}]: ${typeToString(typeChecker, member.type)}}`)
        if (members.length === 1) { return members[0] }
        return members
    }

    if (type.literal) {
        if (type.literal.text) { return type.literal.text }
        if (type.typeName) { return type.typeName.escapedText }

        const kind = kindToText(type.literal.kind)

        if (kind) { return kind }
    }

    if (type.typeName) { return type.typeName.escapedText }

    if (type.types) { return type.types.map((val: any) => typeToString(typeChecker, val)).join(' | ') }

    const kind = kindToText(type.kind)

    if (kind) { return kind }

    if (type.objectType) { return `${type.objectType.typeName.escapedText}[${type.indexType.literal.text}]` }

    if (type.elementType && type.kind === ts.SyntaxKind.ArrayType) { return `${typeToString(typeChecker, type.elementType)}[]` }

    return 'unknown'
}

function typeString(typeChecker: ts.TypeChecker, node: any) {
    return node.type ? typeToString(typeChecker, node) : getNodeTypeFromSymbol(typeChecker, node)
}

function classSchema(typeChecker: ts.TypeChecker, node: any) {
    const result: ClassSchema = {
        methods: {},
        properties: {},
        name: node.name.escapedText
    }

    Object.assign(result, getDocs(node))

    /** TDOD */
    // if (node.heritageClauses) {}

    if (node.members) {
        node.members.forEach((member: any) => {
            if (member.kind === ts.SyntaxKind.Constructor) { return }

            if (member.kind === ts.SyntaxKind.MethodDeclaration) {
                return result.methods[member.name.escapedText] = Object.assign(getDocs(member), {
                    name: member.name.escapedText,
                    parameters: member.parameters.map((param: any) => parametersSchema(typeChecker, param)),
                    returns: typeString(typeChecker, member)
                })
            }

            if (member.kind === ts.SyntaxKind.PropertyDeclaration) {
                const propertyName = member.name.escapedText
                if (!result.properties[propertyName]) { (result.properties[propertyName] as any) = {} }
                result.properties[propertyName].name = propertyName
                result.properties[propertyName].type = typeString(typeChecker, member)
                result.properties[propertyName].readonly = false
                Object.assign(result.properties[propertyName], getDocs(member))
                return
            }

            if (member.kind === ts.SyntaxKind.SetAccessor) {
                const propertyName = member.name.escapedText
                if (!result.properties[propertyName]) { (result.properties[propertyName] as any) = {} }
                result.properties[propertyName].name = propertyName
                result.properties[propertyName].readonly = false
                if (member.parameters) {
                    result.properties[propertyName].type = typeString(typeChecker, member.parameters[0])
                }
                Object.assign(result.properties[propertyName], getDocs(member))
                return
            }

            if (member.kind === ts.SyntaxKind.GetAccessor) {
                const propertyName = member.name.escapedText
                if (!result.properties[propertyName]) { (result.properties[propertyName] as any) = { readonly: true } }
                result.properties[propertyName].name = propertyName
                result.properties[propertyName].type = typeString(typeChecker, member)
                Object.assign(result.properties[propertyName], getDocs(member))
                return
            }
        })
    }

    return result
}

function parametersSchema(typeChecker: ts.TypeChecker, param: any): ParameterSchema {
    return Object.assign({}, getDocs(param), {
        name: param.name.escapedText,
        type: typeString(typeChecker, param),
        optional: !!param.questionToken
    })
}

function propertySchema(typeChecker: ts.TypeChecker, property: any): PropertySchema {
    return {
        name: property.name.escapedText,
        type: typeString(typeChecker, property)
    }
}

function typeAliasSchems(typeChecker: ts.TypeChecker, node: any): TypeSchema {
    return {
        name: node.name.escapedText as string,
        properties: node.type && node.type.members ? node.type.members.map((member: any) => propertySchema(typeChecker, member)) : []
    }
}

function importSchema(node: any) {
    const result: ImportSchema = {
        from: node.moduleSpecifier.text
    }

    if (node.importClause) {
        if (node.importClause.name) { result.name = node.importClause.name.getText() }

        if (node.importClause.namedBindings) { result.names = node.importClause.namedBindings.elements.map((binding: any) => binding.name.escapedText) }
    }

    return result
}

function srcToDist(src: string) {
    const initial = !src.includes(root) ? path.join(root, src) : src
    return initial.split(`/${Config.source}/`).join(`/${Config.assets}/`)
}

function schemaFilename(src: string) {
    return `${path.basename(src, path.extname(src))}.json`
}

export default function transformJson(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    return _context => file => {
        const typeChecker = program.getTypeChecker()
        const sourcePath = path.dirname((file as ts.SourceFile).fileName)
        const outPath = srcToDist(`${path.join(sourcePath, schemaFilename((file as ts.SourceFile).fileName))}`)
        const imports: ImportSchema[] = []
        const definitions = {}
        const errors: any[] = []

        ts.forEachChild(file, node => {
            const _node = node as any
            const name = _node.name ? _node.name.getText() : undefined

            if (!isNodeExported(node) || ts.SyntaxKind.EndOfFileToken === node.kind || ts.isExportDeclaration(node)) { return }

            if (ts.isImportDeclaration(node)) {
                imports.push(importSchema(node))
            } else if (ts.isTypeAliasDeclaration(node)) {
                const type = typeAliasSchems(typeChecker, node)
                Object.assign(definitions, { [type.name]: type })
            } else if (ts.isClassDeclaration(node)) {
                const result = classSchema(typeChecker, node)
                Object.assign(definitions, { [result.name]: result })
            }
            // LOG AS ERRORS FOR NOW
            else if (name) {
                errors.push(name)
            } else if (ts.isExpressionStatement(node)) {
                errors.push((node.expression as any).arguments[0].text)
            } else if (ts.SyntaxKind.FirstStatement === node.kind) {
                errors.push((node as any).declarationList.declarations[0].name.escapedText)
            } else if (ts.SyntaxKind.ExportAssignment === node.kind) {
                errors.push((node as any).symbol.escapedName)
            } else {
                errors.push(node.kind)
            }

        })

        const resultString = JSON.stringify({ imports, definitions, errors })

        ts.sys.writeFile(outPath, resultString)

        return file
    }
}