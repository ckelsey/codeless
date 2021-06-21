import { lstatSync } from "fs"
import path from "path"
import ts from "typescript"

const importTransformer = (_program: ts.Program) => transformerFactory

function visitSourceFile(sourceFile: ts.SourceFile, context: ts.TransformationContext) {
    const sourcePath = path.dirname(sourceFile.fileName)

    return visitNodeAndChildren(sourceFile)

    function visitNodeAndChildren(node: ts.Node): ts.Node {
        if (node == null) { return node }

        node = visitNode(node)

        return ts.visitEachChild(
            node,
            childNode => visitNodeAndChildren(childNode),
            context
        )
    }

    function visitNode(node: ts.Node) { return ts.isImportDeclaration(node) ? visitImportNode(node) : node }

    function isValidPath(importPath: string, addOn: string) {
        try {
            lstatSync(path.join(sourcePath, `${importPath}${addOn}`))
            return true
        } catch (error) {
            return false
        }
    }

    function formatExtension(node: ts.ImportDeclaration, importPath: string) {
        let newPath = ''

        if (isValidPath(importPath, '.ts')) {
            newPath = `${importPath}.js`
        } else if (isValidPath(importPath, '/index.ts')) {
            newPath = `${importPath}/index.js`
        }

        return context.factory.updateImportDeclaration(
            node,
            node.decorators,
            node.modifiers,
            node.importClause,
            context.factory.createStringLiteral(newPath)
        )
    }

    function visitImportNode(node: ts.ImportDeclaration) {
        if (!node.moduleSpecifier) { return node }
        const importPath = node.moduleSpecifier.getText().replace(/"|'/gm, '')
        const fileName = importPath.split('/').pop() || ''
        const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : ''

        // add the correct filename/extension
        if (ext === '') { return formatExtension(node, importPath) }

        return node
    }
}

const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => file => visitSourceFile(file, context) as ts.SourceFile

export default importTransformer