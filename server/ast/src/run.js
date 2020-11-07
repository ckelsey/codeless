const fs = require('fs')
const path = require('path')
const writeFile = require('./write-file')
const ast2Js = require('./ast-to-js')
const getAst = require('./get-ast')
// const transformTs = require('./transform-ts')
const getFile = require('./get-file')

const root = path.join(__dirname, '..')
const generatedDir = path.join(root, 'generated')
const parsedDir = path.join(root, 'parsed')

if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir)
}

if (!fs.existsSync(parsedDir)) {
    fs.mkdirSync(parsedDir)
}

// const fileContents = transformTs('function sayHi(nameOfPerson:string, num:number){const result = `Hi ${name}! It\'s ${num} o\'clock`;\nreturn result}')
// const ast = getAst(fileContents)
const ast = getFile(path.join(__dirname, '..', 'parsed', 'ast-1.json'))
const js = ast2Js(ast)
writeFile(ast, path.join(parsedDir, 'ast.json'))
writeFile(js, path.join(generatedDir, 'js.js'))

console.log('DONE')