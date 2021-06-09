import { SyntaxKind } from 'typescript'

const syntaxTypes = {}

// function getTypeName(value: any) {
//     if (value === null) { return 'null' }

//     if (['undefined', 'number', 'string', 'boolean'].indexOf(typeof value) >= 0) { return typeof value }

//     if (value instanceof Array) {
//         const itemTypes = Array
//             .from(new Set(value.map((v) => getTypeName(v))))
//             .filter((t) => t !== 'null')

//         if (itemTypes.length === 0) { return '[]' }
//         if (itemTypes.length === 1) { return itemTypes[0] + '[]' }

//         return `Array<${itemTypes.sort().join('|')}>`
//     }

//     if (value.constructor && value.constructor.name) { return value.constructor.name }

//     return 'any'
// }

for (const name of Object.keys(SyntaxKind).filter(x => isNaN(parseInt(x)))) {
    const value = SyntaxKind[name]
    if (!syntaxTypes[value]) { syntaxTypes[value] = name }
}

console.log(syntaxTypes)

export default syntaxTypes