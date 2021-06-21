import { resolve } from 'path'
import { watch, FSWatcher } from 'fs'
import notifier from 'node-notifier'
import tsConfig from "./ts-config.js"
// import renderJS from './render-js.js'
import compileTypescript from './compile_typescript.js'
// import glob from 'glob'
import './server.js'

const root = resolve('')
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

    const start = new Date()
    clearTimeout(timer)

    function endCompile(res: any, errored = false) {
        runningTS = false
        runningTransforms = true

        if (res.messages.length) {
            console.log('TYPESCRIPT MESSAGES:')
            console.log(res.messages.join('\n'))
        }

        const msg = `Compile/render ${errored ? 'errored' : 'completed'} for ${!!filename ? filename : 'all'} in ${new Date().getTime() - start.getTime()}ms`

        notifier.notify(msg)
        console.log(msg)
        console.log(' ')
        runningTransforms = false

        if (queue.length) {
            run('change', queue.shift())
        }
    }

    timer = setTimeout(() => {
        console.log(`Running compiler on ${!!filename ? filename : 'all'}...${start.toString()}`)
        runningTS = true
        compileTypescript(tsConfig(!!filename ? resolve(root, 'src', filename) : ''))
            .then((res: any) => endCompile(res, false))
            .catch((res: any) => endCompile(res, true))
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