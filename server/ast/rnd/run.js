const fs = require('fs')
const path = require('path')
const generator = require('@babel/generator')
const json = fs.readFileSync(path.join(__dirname, '..', 'parsed', 'ast-1.json'))

const generated = generator.default(JSON.parse(json), {}).code
// fs.writeFileSync('./generated.js', generated)
// console.log(json.toString())
console.log(generated)