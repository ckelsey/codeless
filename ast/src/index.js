const fs = require('fs')
const path = require('path')
const writeFile = require('./write-file')
const ast2Js = require('./ast-to-js')
const getAst = require('./get-ast')
const transformTs = require('./transform-ts')
const getFile = require('./get-file')
const fileUrl = process.env.FILE

const root = path.join(__dirname, '..')
const generatedDir = path.join(root, 'generated')
const parsedDir = path.join(root, 'parsed')

if (!fileUrl) { return console.log('FILE= argument is required') }

if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir)
}

if (!fs.existsSync(parsedDir)) {
    fs.mkdirSync(parsedDir)
}

let fileContents = getFile(fileUrl)

if (fileUrl.split('.').pop() == 'ts') {
    fileContents = transformTs(fileContents)
}

const ast = getAst(fileContents)
const js = ast2Js(ast)
writeFile(ast, path.join(parsedDir, 'ast.json'))
writeFile(js, path.join(generatedDir, 'js.js'))

console.log('DONE')