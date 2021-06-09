import { createSourceFile, ScriptTarget, SyntaxKind, isFunctionDeclaration } from 'typescript';
import Get from '../objects/get';
import syntaxTypes from './types';
const source = (code) => createSourceFile('tmp.ts', code, ScriptTarget.Latest, true);
const syntaxToKind = (kind) => syntaxTypes[kind] || SyntaxKind[kind];
const getValue = (value, kind) => kind === 8 ? parseFloat(value) : value;
function callExpression(expression) {
  if (!expression.expression) {
    return;
  }
}
function binaryRightData(expression) {
  if (expression.left) {
    return [].concat(binaryRightData(expression.left), [{ kind: 'operator', value: expression.operatorToken.getText() }], binaryRightData(expression.right));
  }
  else {
    return [{ kind: 'value', value: expression.getText() }];
  }
}
function binaryExpression(expression) {
  if (!expression.left) {
    return;
  }
  return {
    action: 'set',
    subject: expression.left.getText(),
    operator: expression.operatorToken.getText(),
    value: binaryRightData(expression.right) || []
  };
}
function statementsData(statements) {
  if (!statements) {
    return;
  }
  const results = [];
  statements.forEach((statement) => {
    if (statement.kind !== 230) {
      console.log('no expression', statement);
      return;
    }
    let result;
    switch (statement.expression.kind) {
      case 213:
        result = binaryExpression(statement.expression);
        break;
      case 200:
        result = callExpression(statement.expression);
        break;
      default:
        console.log('no kind in switch', statement);
    }
    if (result) {
      results.push(result);
    }
  });
  return results;
}
function getFunctionData(node) {
  if (!isFunctionDeclaration(node)) {
    return;
  }
  return {
    name: node.name.text,
    parameters: Get(node, 'parameters', []).map(param => ({
      name: param.name.getText(),
      defaultValue: !param.initializer ? undefined : getValue(param.initializer.getText(), param.initializer.kind),
      type: !param.initializer ? undefined : syntaxToKind(param.initializer.kind)
    })),
    body: statementsData(node.body.statements)
  };
}
function start(node) {
  let result = {};
  node.forEachChild(child => {
    if (isFunctionDeclaration(child)) {
      result = Object.assign({}, {
        imports: [],
        string: node.getText()
      }, getFunctionData(child));
    }
  });
  return result;
}
export default function FunctionReader(code) {
  console.log('FunctionReader code', code);
  const result = start(source(code));
  console.log('FunctionReader result', result);
  return result;
}
