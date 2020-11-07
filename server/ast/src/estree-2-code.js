// const parser = require('@typescript-eslint/typescript-estree').TSESTree

// // const code = 'function sayHi(nameOfPerson:string, num:number){const cars = 10\nconst result = `Hi ${nameOfPerson}! It\'s ${num} o\'clock`\nreturn result}'


// const ast = parser(code, {})

// console.log(code)

const path = require('path')

const converter = require(path.join(__dirname, '..', 'node_modules', '@typescript-eslint', 'typescript-estree', 'dist', 'ast-converter.js'))
const code = JSON.parse(require('fs').readFileSync(path.join(__dirname, '..', 'parsed', 'ast-1.json')).toString())
code.parseDiagnostics = []
// console.log(code)
console.log(converter.astConverter(code))
