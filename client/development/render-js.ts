import { join } from 'path'
import { lstatSync, readFileSync, writeFileSync } from 'fs'
import { minify } from 'html-minifier'
import { renderSync } from 'node-sass'

interface AddAsString {
    index: number
    code: string
    name: string
    text: string
}

const processFile = (proccessedPath: string, code: string): string => {
    const ext = proccessedPath.split('.').pop()

    if (ext === 'html') {
        return minify(code, {
            continueOnParseError: true,
            minifyCSS: true,
            minifyJS: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true
        })
    } else if (ext === 'scss' || ext === 'css') {
        return renderSync({ file: proccessedPath, outputStyle: 'compressed' }).css.toString().trim()
    } else {
        return code
    }
}

const getText = (base: string, path: string) => {
    const proccessedPath = join(lstatSync(base).isFile() ? join(base, '..') : base, path).split('/dist/').join('/src/')

    try {
        return processFile(proccessedPath, readFileSync(proccessedPath).toString())
    } catch (error) {
        console.log(error)
        return false
    }
}

const getJsPath = (base: string, path: string) => {
    const proccessedPath = join(lstatSync(base).isFile() ? join(base, '..') : base, path)
    let attemptedPath = proccessedPath

    try {
        const node = lstatSync(attemptedPath)
        if (node.isDirectory()) { throw new Error() }
        return path
    } catch (error) {
        try {
            attemptedPath = `${proccessedPath}.js`
            const node = lstatSync(attemptedPath)
            if (node.isDirectory()) { throw new Error() }
            return `${path}.js`
        } catch (error) {
            try {
                attemptedPath = join(proccessedPath, 'index.js')
                lstatSync(attemptedPath)
                return join(path, 'index.js')
            } catch (error) {
                return false
            }
        }
    }
}

const renderJS = (path: string) => {
    const ext = path.split('.').pop()

    if (ext !== 'js') { return }

    const code = readFileSync(path).toString().split('\n')
    const toReplace = []
    const toAddAsString: AddAsString[] = []
    let i = 0
    let lastImportIndex = 0

    while (i < code.length) {
        if (code[i].startsWith('import ')) {
            toReplace.push({ index: i, code: code[i], text: '', name: '' })
            lastImportIndex = i
        } else { break }

        i = i + 1
    }

    toReplace.forEach(data => {
        const parts = data.code.split(/;|'|"|import | from /).filter(part => !!part)
        const importPath = parts.pop() || ''
        const jsPath = getJsPath(path, importPath)

        if (jsPath) {
            code[data.index] = `import ${parts[0]} from '${jsPath}';`
        } else {
            const proccessedText = getText(path, importPath)

            if (proccessedText !== false) {
                data.text = proccessedText
                data.name = parts[0]
                toAddAsString.push(data)
            }
        }
    })

    while (toAddAsString.length) {
        const data = toAddAsString.pop()
        if (data) {
            code.splice(lastImportIndex + 1, 0, `const ${data.name} = \`${data.text}\`;`)
            code.splice(data.index, 1)
        }
    }

    writeFileSync(path, code.join('\n'))
}

export default renderJS