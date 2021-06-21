import { readFileSync } from "fs"
import path from "path"
import ts from "typescript"
import { minify } from 'html-minifier'
import { renderSync } from 'node-sass'

const requireTransformer = (_program: ts.Program) => transformerFactory

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

    function declarationReducer(result: boolean, declaration: any) {
        if (result !== true) {
            result = !!declaration.initializer &&
                !!declaration.initializer.expression &&
                declaration.initializer.expression.getText() === 'require'
        }
        return result
    }

    function isRequiredNode(node: ts.VariableStatement) {
        return ts.isVariableStatement(node) &&
            !!node.declarationList &&
            !!node.declarationList.declarations &&
            node.declarationList.declarations.reduce(declarationReducer, false) === true
    }

    function visitNode(node: ts.Node) {
        return isRequiredNode(node as ts.VariableStatement) ? visitRequiredNode(node as ts.VariableStatement) : node
    }

    function getInitializer(node: ts.VariableStatement) {
        return node.declarationList.declarations[0]?.initializer as ts.CallExpression
    }

    function getRequiredPath(initializer: ts.CallExpression) {
        return initializer.arguments[0].getText().replace(/"|'/gm, '')
    }

    function getCode(importPath: string, ext: string) {
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

    function createLiteral(node: ts.VariableStatement, requiredPath: string, ext: string) {
        const name = node.declarationList.declarations[0]?.name?.getText() || ''
        const code = getCode(requiredPath, ext)

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

    function visitRequiredNode(node: ts.VariableStatement) {
        const initializer = getInitializer(node)
        const requiredPath = getRequiredPath(initializer)
        const fileName = requiredPath.split('/').pop() || ''
        const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : ''

        if (['scss', 'css', 'html'].indexOf(ext) > -1) { return createLiteral(node, requiredPath, ext) }
        return node
    }

    // function getCode(sourcePath: string, importPath: string, ext: string) {
    //     if (ext === 'html') {
    //         return minify(readFileSync(path.join(sourcePath, importPath)).toString(), {
    //             continueOnParseError: true,
    //             minifyCSS: true,
    //             minifyJS: true,
    //             collapseWhitespace: true,
    //             collapseInlineTagWhitespace: true
    //         })
    //     }

    //     if (['scss', 'css'].indexOf(ext) > -1) {
    //         return renderSync({ file: path.join(sourcePath, importPath), outputStyle: 'compressed' }).css.toString().trim()
    //     }

    //     return ''
    // }

    // function createLiteral(node: ts.ImportDeclaration, sourcePath: string, importPath: string, ext: string) {
    //     const name = node.importClause?.name?.getText() || 'name'
    //     const code = getCode(sourcePath, importPath, ext)

    //     if (!name || !code) { return node }

    //     return context.factory.createVariableStatement(
    //         undefined,
    //         context.factory.createVariableDeclarationList(
    //             [
    //                 context.factory.createVariableDeclaration(
    //                     context.factory.createIdentifier(name),
    //                     undefined, undefined,
    //                     context.factory.createStringLiteral(code)
    //                 ),
    //             ],
    //             ts.NodeFlags.Const,
    //         )
    //     )
    // }

    // function visitImportNode(node: ts.ImportDeclaration) {
    //     if (!node.moduleSpecifier) { return node }

    //     const sourcePath = path.dirname(sourceFile.fileName)
    //     const importPath = node.moduleSpecifier.getText().replace(/"|'/gm, '')
    //     const fileName = importPath.split('/').pop() || ''
    //     const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : ''

    //     // render css/scss/html imports as literal
    //     if (['scss', 'css', 'html'].indexOf(ext) > -1) { return createLiteral(node, sourcePath, importPath, ext) }

    //     return node
    // }
}

const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => file => visitSourceFile(file, context) as ts.SourceFile

export default requireTransformer