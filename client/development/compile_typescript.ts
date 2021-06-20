// import { readFileSync } from "fs"
import ts, { CompilerOptions, Node, Declaration } from "typescript"

function getFileName(node: any) { return node?.parent?.originalFileName }

function isNodeExported(node: Node): boolean {
    return ((ts.getCombinedModifierFlags(node as Declaration) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile))
}

export default function compileTypescript(fileNames: string[], config: CompilerOptions) {
    return new Promise((resolve, reject) => {
        const ast: { [key: string]: any } = {}

        const visit = (node: ts.Node) => {
            if (!isNodeExported(node)) { return }


            ast[getFileName(node)] = node
        }

        const program = ts.createProgram(fileNames, config)
        const emitResult = program.emit()
        const messages: string[] = []
        const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

        for (const sourceFile of program.getSourceFiles()) {
            if (!sourceFile.isDeclarationFile) {
                ts.forEachChild(sourceFile, visit)
            }
        }

        const emitted: string[] = Object.keys(ast)

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