const { readdirSync, statSync, writeFileSync } = require('fs')
const { join } = require('path')
import { readFileSync } from 'fs'
import * as ts from 'typescript'

const filesPath = join(__dirname, 'files.ts')
const utilsDir = join(__dirname, '..', 'src', 'utils')
// const utilFiles: string[] = []
const utilFiles: string[] = ['/Users/chriskelsey/Sites/ck/codeless/src/utils/function-helpers/pipe.ts']

function isDir(path: string) {
    try {
        return statSync(path).isDirectory()
    } catch (error) {
        return false
    }
}

function getFiles(path: string) {
    return readdirSync(path).map((name: string) => join(path, name))
}
function getDirectories(path: string) {
    return readdirSync(path).map((name: string) => join(path, name)).filter(isDir)
}

function gatherFiles(path: string) {
    getDirectories(path).map((dir: string) => gatherFiles(dir))
    getFiles(path).map((file: string) => utilFiles.push(file))
}

// gatherFiles(utilsDir)

// writeFileSync(filesPath, utilFiles.map(file => `import '${file}'`).join('\n'))
writeFileSync(filesPath, readFileSync(utilFiles[0]))

const program = ts.createProgram([filesPath], {})
program.emit()
// const checker = program.getTypeChecker()
// const source = program.getSourceFile(filesPath)
// const printer = ts.createPrinter()
// const syntaxToKind = (kind: ts.Node["kind"]) => ts.SyntaxKind[kind]

// ts.forEachChild(source, (node: any) => {
//     console.log(node)
// })

// if (source) {
//     ts.forEachChild(source, (node: any) => {
//         console.log('name', node)
//         const symbol = checker.getSymbolAtLocation(node.name)
//         console.log('symbol', symbol)
//         if (symbol) {
//             const type = checker.getDeclaredTypeOfSymbol(symbol)
//             console.log(type)
//             const properties = checker.getPropertiesOfType(type)
//             console.log(properties)
//         }
//     })
// }
