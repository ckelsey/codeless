import { createSourceFile, ScriptTarget, SyntaxKind, Node, isFunctionDeclaration, NodeArray, Statement, ExpressionStatement, BinaryExpression, CallExpression } from 'typescript'
import Get from '../objects/get'
import syntaxTypes from './types'

export interface binaryValues {
    kind: 'operator' | 'value',
    value: string
}

export interface FunctionParameters {
    name: string
    type?: any
    defaultValue?: any
}

export interface FunctionStatement {
    action: 'set' | 'call' | 'return',
    subject?: string
    operator?: '='
    value?: binaryValues[]
    arguments?: any[]
}

export interface FunctionData {
    imports: any[]
    name: string
    parameters: FunctionParameters[]
    body: FunctionStatement[],
    string: string
}

const source = (code: string) => createSourceFile('tmp.ts', code, ScriptTarget.Latest, true)

const syntaxToKind = (kind: Node["kind"]) => syntaxTypes[kind] || SyntaxKind[kind]

const getValue = (value, kind) => kind === 8 ? parseFloat(value) : value

function callExpression(expression: CallExpression) {
    if (!expression.expression) { return }
}

function binaryRightData(expression: BinaryExpression): binaryValues[] {
    if (expression.left) {
        return [].concat(
            binaryRightData(expression.left as BinaryExpression),
            [{ kind: 'operator', value: expression.operatorToken.getText() }],
            binaryRightData(expression.right as BinaryExpression),
        )
    } else {
        return [{ kind: 'value', value: expression.getText() }]
    }
}

function binaryExpression(expression: BinaryExpression) {
    if (!expression.left) { return }

    return {
        action: 'set',
        subject: expression.left.getText(),
        operator: expression.operatorToken.getText(),
        value: binaryRightData(expression.right as BinaryExpression) || []
    }
}

function statementsData(statements: NodeArray<Statement>) {
    if (!statements) { return }

    const results = []

    statements.forEach((statement: ExpressionStatement) => {
        if (statement.kind !== 230) {
            console.log('no expression', statement)
            return
        }

        let result

        switch (statement.expression.kind) {
            case 213:
                result = binaryExpression(statement.expression as BinaryExpression)
                break;

            case 200:
                result = callExpression(statement.expression as CallExpression)
                break;

            default:
                console.log('no kind in switch', statement)
        }

        if (result) { results.push(result) }
    })

    return results
}

function getFunctionData(node: Node) {
    if (!isFunctionDeclaration(node)) { return }

    return {
        name: node.name.text,
        parameters: Get(node, 'parameters', []).map(param => ({
            name: param.name.getText(),
            defaultValue: !param.initializer ? undefined : getValue(param.initializer.getText(), param.initializer.kind),
            type: !param.initializer ? undefined : syntaxToKind(param.initializer.kind)
        })),
        body: statementsData(node.body.statements)
    }
}

function start(node: Node): FunctionData {
    let result = {}

    node.forEachChild(child => {
        if (isFunctionDeclaration(child)) {
            result = Object.assign(
                {},
                {
                    imports: [],
                    string: node.getText()
                },
                getFunctionData(child)
            )
        }
    })

    return result as FunctionData
}

export default function FunctionReader(code: string): FunctionData {
    console.log('FunctionReader code', code)

    const result = start(source(code))

    console.log('FunctionReader result', result)

    return result
}
