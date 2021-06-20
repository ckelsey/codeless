const path = require('path')
const fs = require('fs')
const htmlMinifier = require('html-minifier').minify
const sass = require('node-sass')
const notifier = require('node-notifier')
const { spawn } = require('child_process')
const root = path.resolve(__dirname, '..')
const distPath = path.resolve(root, 'dist')
let timer = false
let runningTS = false
let runningTransforms = false
let queue = []
let compilerChild
let watcher

require('./server')

const processFile = (proccessedPath, code) => {
    const ext = proccessedPath.split('.').pop()

    if (ext === 'html') {
        return htmlMinifier(code, {
            continueOnParseError: true,
            minifyCSS: true,
            minifyJS: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true
        })
    } else if (ext === 'scss' || ext === 'css') {
        return sass.renderSync({ file: proccessedPath, outputStyle: 'compressed' }).css.toString().trim()
    } else {
        return code
    }
}

const getText = (base, _path) => {
    const proccessedPath = path.join(fs.lstatSync(base).isFile() ? path.join(base, '..') : base, _path).split('/dist/').join('/src/')

    try {
        return processFile(proccessedPath, fs.readFileSync(proccessedPath).toString())
    } catch (error) {
        console.log(error)
        return false
    }
}

const getJsPath = (base, _path) => {
    const proccessedPath = path.join(fs.lstatSync(base).isFile() ? path.join(base, '..') : base, _path)
    let attemptedPath = proccessedPath

    try {
        const node = fs.lstatSync(attemptedPath)
        if (node.isDirectory()) { throw new Error() }
        return _path
    } catch (error) {
        try {
            attemptedPath = `${proccessedPath}.js`
            const node = fs.lstatSync(attemptedPath)
            if (node.isDirectory()) { throw new Error() }
            return `${_path}.js`
        } catch (error) {
            try {
                attemptedPath = path.join(proccessedPath, 'index.js')
                fs.lstatSync(attemptedPath)
                return path.join(_path, 'index.js')
            } catch (error) {
                return false
            }
        }
    }
}

const visit = _path => {
    const ext = _path.split('.').pop()

    if (ext !== 'js') { return }

    const code = fs.readFileSync(_path).toString().split('\n')
    const toReplace = []
    const toAddAsString = []
    let i = 0
    let lastImportIndex

    while (i < code.length) {
        if (code[i].startsWith('import ')) {
            toReplace.push({ index: i, code: code[i] })
            lastImportIndex = i
        } else { break }

        i = i + 1
    }

    toReplace.forEach(data => {
        const parts = data.code.split(/;|'|"|import | from /).filter(part => !!part)
        const importPath = parts.pop()
        const jsPath = getJsPath(_path, importPath)

        if (jsPath) {
            code[data.index] = `import ${parts[0]} from '${jsPath}';`
        } else {
            const proccessedText = getText(_path, importPath)

            if (proccessedText !== false) {
                data.text = proccessedText
                data.name = parts[0]
                toAddAsString.push(data)
            }
        }
    })

    while (toAddAsString.length) {
        const data = toAddAsString.pop()
        code.splice(lastImportIndex + 1, 0, `const ${data.name} = \`${data.text}\`;`)
        code.splice(data.index, 1)
    }

    fs.writeFileSync(_path, code.join('\n'))
}

function killCompiler() {
    if (compilerChild) {
        compilerChild.stdout.pause()
        compilerChild.stderr.pause()
        compilerChild.kill()
        compilerChild = null
    }
}

function configData(pathToFile, config) {
    if (!pathToFile) { return config }

    const ext = pathToFile.split('.').pop()

    return Object.assign(
        {},
        config,
        {
            compilerOptions: Object.assign(
                {},
                config.compilerOptions,
                {
                    rootDir: path.join(root, 'src'),
                    outDir: path.join(root, 'dist')
                }
            ),
            include: [
                path.join(root, 'src', 'types', '*.ts'),
                ext === 'ts' ? path.join(root, 'src', pathToFile) : path.join(root, 'src', 'components', '**', '*.ts')
            ]
        }
    )
}



const run = (kind, filename) => {
    if (runningTS || runningTransforms) {
        queue.push(filename)
        return
    }

    try {
        const distDir = fs.lstatSync(distPath)
        if (!distDir) { throw Error }
    } catch (error) {
        fs.mkdirSync(distPath)
    }

    const start = new Date()
    clearTimeout(timer)
    const filesEmitted = []

    timer = setTimeout(() => {
        console.log(`Running compiler on ${filename || 'all'}...${start.toString()}`)

        runningTS = true
        killCompiler()

        if (filename) { makeConfig(filename) }

        compilerChild = spawn('tsc', ['--project', filename ? './tmp/' : '.', '--listEmittedFiles'])

        compilerChild.on('exit', () => {
            runningTS = false
            runningTransforms = true

            console.log(`Files compiled and now rendering:`)
            console.log(filesEmitted)

            if (filesEmitted.length) {
                filesEmitted.forEach(file => visit(path.join(root, file)))
            }

            const msg = `Compile/render completed for ${filename || 'all'} in ${new Date().getTime() - start.getTime()}ms`
            timer = false

            notifier.notify(msg)
            console.log(msg)
            console.log(' ')
            runningTransforms = false

            if (queue.length) {
                run('change', queue.shift())
            }
        })

        compilerChild.stdout.on('data', message => {
            const messages = []
            const lines = message.toString().split('\n')

            lines.forEach(line => {
                if (line.slice(0, 8) === 'TSFILE: ') {
                    filesEmitted.push(line.split(path.resolve(root))[1])
                } else if (!!line) {
                    messages.push(line)
                }
            })

            if (messages.length) {
                console.log(' ')
                console.log('TYPESCRIPT:')
                console.log(messages.join('\n'))
                console.log(' ')
            }
        })

        compilerChild.stderr.on('data', error => {
            console.log(' ')
            console.log('TYPESCRIPT ERROR')
            console.log(error.toString())
            console.log(' ')
        })
    }, 66)
}

run()

if (process.env.NODE_ENV === 'development') {
    watcher = fs.watch(path.resolve(root, 'src'), { recursive: true }, run)
}

process.on('SIGINT', () => {
    console.log('GOOOODBYE')
    killCompiler()
    if (watcher && watcher.kill) { watcher.kill() }
    process.exit()
})