const parser = require('@typescript-eslint/typescript-estree').parse

// const code = 'function sayHi(nameOfPerson:string, num:number){const cars = 10\nconst result = `Hi ${nameOfPerson}! It\'s ${num} o\'clock`\nreturn result}'

const code = require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'src', 'utils', 'types', 'is-object.ts')).toString()

const ast = parser(code, {})

console.log(JSON.stringify(ast))
// console.log(ast.services.program.getFileProcessingDiagnostics().getGlobalDiagnostics())