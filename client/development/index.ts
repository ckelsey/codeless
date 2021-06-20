import { resolve } from 'path'
import { lstatSync, mkdirSync, watch, FSWatcher } from 'fs'
import notifier from 'node-notifier'
import tsConfig from "./ts-config.js"
import renderJS from './render-js.js'
import compileTypescript from './compile_typescript.js'
import glob from 'glob'
import './server.js'

const root = resolve('')
const distPath = resolve(root, 'dist')
let timer: NodeJS.Timeout
let watcher: FSWatcher | undefined
let runningTS = false
let runningTransforms = false
let queue: string[] = []

function run(_kind?: string, filename?: string) {
    if (runningTS || runningTransforms) {
        queue.push(filename || '')
        return
    }

    try {
        const distDir = lstatSync(distPath)
        if (!distDir) { throw Error }
    } catch (error) {
        mkdirSync(distPath)
    }

    const start = new Date()
    clearTimeout(timer)

    timer = setTimeout(() => {
        console.log(`Running compiler on ${!!filename ? filename : 'all'}...${start.toString()}`)
        runningTS = true

        const config = tsConfig(!!filename ? resolve(root, 'src', filename) : '')

        compileTypescript(config.files, config.options)
            .then((res: any) => {
                runningTS = false
                runningTransforms = true

                console.log('files', Object.keys(res.ast))

                if (res.messages.length) {
                    console.log('TYPESCRIPT MESSAGES:')
                    console.log(res.messages.join('\n'))
                }

                const filesEmitted = glob.sync(resolve(distPath, '**'))

                if (filesEmitted.length) {
                    filesEmitted.forEach(file => renderJS(file))
                }

                const msg = `Compile/render completed for ${!!filename ? filename : 'all'} in ${new Date().getTime() - start.getTime()}ms`

                notifier.notify(msg)
                console.log(msg)
                console.log(' ')
                runningTransforms = false

                if (queue.length) {
                    run('change', queue.shift())
                }
            })
            .catch(console.log)
    }, 120)
}

if (process.env.NODE_ENV === 'development') {
    watcher = watch(resolve(root, 'src'), { recursive: true }, run)
}

run()

process.on('SIGINT', () => {
    console.log('GOODBYE')
    if (watcher) { watcher.close() }
    process.exit()
})