const fs = require('fs')
const generator = require('@babel/generator')
const json = fs.readFileSync('./parsed-ast.json')

const generated = generator.default(JSON.parse(json), {}).code
fs.writeFileSync('./generated.js', generated)
// console.log(json.toString())
console.log(generated)