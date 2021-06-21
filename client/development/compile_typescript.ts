import ts from "typescript"
import importTransformer from "./import-transformer.js"
import requireTransformer from "./require-transformer.js"

interface DocEntry {
    name?: string
    fileName?: string
    documentation?: string
    type?: string
    constructors?: DocEntry[]
    parameters?: DocEntry[]
    returnType?: string
}

export default function compileTypescript(config: { files: string[], options: ts.CompilerOptions }) {
    const { files, options } = config

    return new Promise((resolve, reject) => {
        const ast: DocEntry[] = []
        const program = ts.createProgram(files, options)
        const transformers: ts.CustomTransformers = {
            "after": [
                importTransformer(program),
                requireTransformer(program)
            ]
        }
        const emitResult = program.emit(undefined, undefined, undefined, false, transformers)
        const messages: string[] = []
        const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
        const emitted: string[] = []

        diagnostics.forEach((diagnostic: any) => {
            if (diagnostic.file) {
                const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!)
                const message = `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
                if (messages.indexOf(message) === -1) {
                    messages.push(message)
                }
            } else {
                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
                if (messages.indexOf(message) === -1) {
                    messages.push(message)
                }
            }
        })

        const result = { ast, emitResult, emitted, messages, diagnostics }

        return !emitResult.emitSkipped ? resolve(result) : reject(result)
    })
}









// const visit = (node: ts.Node) => {
        //     if (!isNodeExported(node)) { return }
        //     ast[getFileName(node)] = nodeToAst(node)
        // }


// const checker = program.getTypeChecker()
 // for (const sourceFile of program.getSourceFiles()) {
        //     if (!sourceFile.isDeclarationFile) {
        //         ts.forEachChild(sourceFile, visit(checker, ast))
        //     }
        // }
// const emitted: string[] = Object.keys(ast)
        // console.log(JSON.stringify(ast))




// function getFileName(node: any) { return node?.parent?.originalFileName }

// function isNodeExported(node: Node): boolean {
//     return ((ts.getCombinedModifierFlags(node as Declaration) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile))
// }

/** Serialize a symbol into a json object */
// function serializeSymbol(checker: ts.TypeChecker) {
//     return function serializeSymbolInner(symbol: ts.Symbol): DocEntry {
//         return {
//             name: symbol.getName(),
//             documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
//             type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!))
//         }
//     }
// }

/** Serialize a signature (call or construct) */
// function serializeSignature(checker: ts.TypeChecker) {
//     return function serializeSignatureInner(signature: ts.Signature) {
//         return {
//             parameters: signature.parameters.map(serializeSymbol(checker)),
//             returnType: checker.typeToString(signature.getReturnType()),
//             documentation: ts.displayPartsToString(signature.getDocumentationComment(checker))
//         }
//     }
// }

/** Serialize a class symbol information */
// function serializeClass(checker: ts.TypeChecker) {
//     return function serializeClassInner(symbol: ts.Symbol) {
//         const details = serializeSymbol(checker)(symbol)
//         details.constructors = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
//             .getConstructSignatures()
//             .map(serializeSignature(checker))

//         return details
//     }
// }

/** visit nodes finding exported classes */
// function visit(checker: ts.TypeChecker, output: DocEntry[]) {
//     return function visitInner(node: ts.Node) {
//         if (!isNodeExported(node)) { return }

//         if (ts.isClassDeclaration(node) && node.name) {
//             // console.log('CLASS::::', node.name.escapedText)
//             // This is a top level class, get its symbol
//             let symbol = checker.getSymbolAtLocation(node.name)
//             if (symbol) {
//                 output.push(serializeClass(checker)(symbol))
//             }
//             // No need to walk any further, class expressions/inner declarations
//             // cannot be exported
//         } else if (ts.isModuleDeclaration(node)) {
//             console.log('MODULE::::', node.name)
//             // This is a namespace, visit its children
//             ts.forEachChild(node, visit(checker, output))
//         } else if (ts.isFunctionDeclaration(node)) {
//             console.log('FUNCTION::::', node)
//             // This is a namespace, visit its children
//             // ts.forEachChild(node, visit(checker, output))
//         } else {
//             // console.log('KIND::::', ts.SyntaxKind[node.kind], node.getFullText())
//         }
//     }
// }

// function nodeToAst(checker: ts.TypeChecker, node: Node) {
//     return function nodeToAstInner(node: Node) {
//         const result = {
//             name: '',
//             exports: {},
//             imports: {}
//         }

//         return result
//     }
// }