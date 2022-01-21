// import notifier from 'node-notifier'
import compileTypescript from "./compile_typescript.js"
import tsConfig from "./ts-config.js"

// const startTime = new Date().getTime()
// const getFiles = () => JSON.parse(process.argv.filter(arg => arg.includes('--compilerfiles=')).map(arg => arg.split('--compilerfiles=')[1])[0] || '[]')
const source = process.argv.filter(arg => arg.includes('--root=')).map(arg => arg.split('--root=')[1])[0]
const assets = process.argv.filter(arg => arg.includes('--out=')).map(arg => arg.split('--out=')[1])[0]
const defaultEntry = process.argv.filter(arg => arg.includes('--defaultEntry=')).map(arg => arg.split('--defaultEntry=')[1])[0]
const files = JSON.parse(process.argv.filter(arg => arg.includes('--compilerfiles=')).map(arg => arg.split('--compilerfiles=')[1])[0] || '[]')

// function send(msg: string) {
//     if (process.send) {
//         process.send(msg)
//     }
// }

function endCompile(_res: any, errored = false) {
    if (!process) { return }

    // if (res.messages && res.messages.length) {
    //     send('TYPESCRIPT MESSAGES:')
    //     send(res.messages.join('\n'))
    // } else if (errored) {
    //     send(res)
    // }

    // const msg = `Compile/render ${errored ? 'errored' : 'completed'} for ${files.join(', ')} in ${new Date().getTime() - startTime}ms`

    // notifier.notify(msg)
    // send(msg)
    // send(' ')

    process.exit(errored ? 0 : 1)
}

const config = tsConfig(source, assets, defaultEntry, files)


// process.on('message', msg => {
//     if (msg === 'exit') {
//         // send('Exiting')
//         process.exit(1)
//     }
// })

// send(`Start compiling ${JSON.stringify(getFiles())}`)

compileTypescript(config)
    .then((res: any) => endCompile(res, false))
    .catch((res: any) => endCompile(res, true))

export { }