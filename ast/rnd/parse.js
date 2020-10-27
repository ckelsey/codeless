const fs = require('fs')
const path = require('path')
const core = require("@babel/core")
const parser = require("@babel/parser")

const filePath = path.resolve(process.env.FILE)
const fileContents = fs.readFileSync(filePath).toString()
const transformed = core.transform(fileContents, { presets: ['@babel/preset-typescript'], filename: filePath.split('/').pop() }).code
console.log(transformed)
// const fileContents = 'var s="hi";console.log(s);function Carl(){ return "hi"}'

const ast = parser.parse(transformed, {
    presets: ['@babel/preset-env', '@babel/preset-typescript'],
    sourceType: 'module'
})

const json = JSON.stringify(ast)
fs.writeFileSync('./parsed-ast.json', json)


console.log(ast)
// // console.log(json)

console.log('DONE')