const tsj = require("ts-json-schema-generator");
const fs = require("fs");

const config = {
    path: "./test.ts",
    // tsconfig: "./tsconfig.json",
    type: "*"
};

const output_path = "test.json";

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
fs.writeFile(output_path, schemaString, (err: any) => {
    if (err) throw err;
});


// import * as ts from 'typescript'

// const fn = {
//     name: 'test',
//     arguments: [{
//         name: 'arg1',
//         type: 'string',
//         default: 'hi'
//     }, {
//         name: 'arg2',
//         type: 'number',
//         default: undefined,
//         required: true
//     }],
//     returnType: 'string',
//     statements: [{
//         type: 'return'
//     }]
// }

// const srcString = `function hi(arg1:string){
//     return 'hi ' + arg1
// }`

// console.log(ts.SyntaxKind)

// const node = ts.createSourceFile('test.ts', srcString, ts.ScriptTarget.Latest)

// node.forEachChild(
//     child => {
//         console.log(ts.SyntaxKind[child.kind])

//         child.forEachChild(
//             _child => {
//                 console.log(ts.SyntaxKind[_child.kind])
//                 console.log(_child)
//             }
//         )
//     }
// )

// console.log(ts.SyntaxKind[node.statements[0].kind])

// function stringToFile(src: string, name: string) {
//     const sourceFile: ts.SourceFile = ts.createSourceFile(`${name}.ts`, src, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TS)
//     const printer: ts.Printer = ts.createPrinter()
//     const result: ts.TransformationResult<ts.SourceFile> = ts.transform<ts.SourceFile>(sourceFile, [])
//     const transformedSourceFile: ts.SourceFile = result.transformed[0]
//     const newContent = printer.printFile(transformedSourceFile)
//     // result.dispose()
//     // return newContent
// }

// const program = ts.createProgram([], {})
// program.emit()

// console.log(stringToFile(srcString, 'test'))

// const program = ts.createProgram([], {})
// program.emit()

// function (){

// }

// `https://ui.dev/?code=function%20hi%28arg1%29%7B%0A%20%20%20%20return%20%27hi%20%27%20%2B%20arg1%0A%7D`