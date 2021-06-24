import path from "path"
import ts from "typescript"
import transformImport from "./transform-import.js"
import transformJson from "./transform-json.js"
import transformRequire from "./transform-require.js"

function getFileName(node: any) { return node?.parent?.originalFileName }

function isNodeExported(node: ts.Node): boolean {
    return ((ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile))
}

const root = path.resolve('')

export default function compileTypescript(config: { files: string[], options: ts.CompilerOptions }) {
    const { files, options } = config

    return new Promise((resolve, reject) => {
        const filesCompiled: string[] = []
        const program = ts.createProgram(files, options)
        const transformers: ts.CustomTransformers = {
            "after": [
                transformJson(program),
                transformImport(program),
                transformRequire(program),
            ],
            // "afterDeclarations": [transformJson(program)]
        }
        const emitResult = program.emit(undefined, undefined, undefined, false, transformers)

        const visit = (node: ts.Node) => {
            const fileName = getFileName(node)
            if (!isNodeExported(node) || filesCompiled.indexOf(fileName) > -1) { return }
            filesCompiled.push(fileName.split(root)[1].slice(1))
        }

        for (const sourceFile of program.getSourceFiles()) {
            if (!sourceFile.isDeclarationFile) {
                ts.forEachChild(sourceFile, visit)
            }
        }

        const messages: string[] = []
        const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

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

        const result = { emitResult, filesCompiled, messages, diagnostics }

        return !emitResult.emitSkipped ? resolve(result) : reject(result)
    })
}