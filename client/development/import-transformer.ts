import { lstatSync, readFileSync } from "fs"
import path from "path"
import ts from "typescript"
import { minify } from 'html-minifier'
import { renderSync } from 'node-sass'

const importTransformer = (_program: ts.Program) => transformerFactory

function visitSourceFile(sourceFile: ts.SourceFile, context: ts.TransformationContext) {
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

    function isValidPath(sourcePath: string, importPath: string, addOn: string) {
        try {
            lstatSync(path.join(sourcePath, `${importPath}${addOn}`))
            return true
        } catch (error) {
            return false
        }
    }

    function formatExtension(node: ts.ImportDeclaration, sourcePath: string, importPath: string) {
        let newPath = ''

        if (isValidPath(sourcePath, importPath, '.ts')) {
            newPath = `${importPath}.js`
        } else if (isValidPath(sourcePath, importPath, '/index.ts')) {
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

    function getCode(sourcePath: string, importPath: string, ext: string) {
        if (ext === 'html') {
            return minify(readFileSync(path.join(sourcePath, importPath)).toString(), {
                continueOnParseError: true,
                minifyCSS: true,
                minifyJS: true,
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true
            })
        }

        if (['scss', 'css'].indexOf(ext) > -1) {
            return renderSync({ file: path.join(sourcePath, importPath), outputStyle: 'compressed' }).css.toString().trim()
        }

        return ''
    }

    function createLiteral(node: ts.ImportDeclaration, sourcePath: string, importPath: string, ext: string) {
        const name = node.importClause?.name?.getText() || 'name'
        const code = getCode(sourcePath, importPath, ext)

        if (!name || !code) { return node }

        return context.factory.createVariableStatement(
            undefined,
            context.factory.createVariableDeclarationList(
                [
                    context.factory.createVariableDeclaration(
                        context.factory.createIdentifier(name),
                        undefined, undefined,
                        context.factory.createStringLiteral(code)
                    ),
                ],
                ts.NodeFlags.Const,
            )
        )
    }

    function visitImportNode(node: ts.ImportDeclaration) {
        if (!node.moduleSpecifier) { return node }

        const sourcePath = path.dirname(sourceFile.fileName)
        const importPath = node.moduleSpecifier.getText().replace(/"|'/gm, '')
        const fileName = importPath.split('/').pop() || ''
        const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : ''

        // No changes needed
        if (['ts', 'js'].indexOf(ext) > -1) { return node }

        // add the correct filename/extension
        if (ext === '') { return formatExtension(node, sourcePath, importPath) }

        // render css/scss/html imports as literal
        if (['scss', 'css', 'html'].indexOf(ext) > -1) { return createLiteral(node, sourcePath, importPath, ext) }

        return node
    }
}

const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => file => visitSourceFile(file, context) as ts.SourceFile

export default importTransformer