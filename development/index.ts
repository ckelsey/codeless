import { resolve } from 'path'

const root = resolve('')

console.log(root, process.argv)

// import { join, dirname, normalize, resolve } from 'path'
// import { exec, ChildProcess } from 'child_process'
// import { watch } from 'fs'
// import Server from './server.js'
// import Config from './config.js'

// const shouldServer = process.argv.indexOf('--server') > -1
// const shouldWatch = process.argv.indexOf('--watch') > -1
// const shouldCompile = process.argv.indexOf('--compile') > -1
// const root = resolve('')
// const thisPath = dirname(normalize(import.meta.url.split('file:').join('')))
// const config = Config
// // let timer: NodeJS.Timeout
// let queue: string[] = []
// let time = new Date().getTime()

// interface CompilerObject {
//     start: () => void
//     kill: (msg: string) => void
//     child: null | ChildProcess
// }

// const Compiler: CompilerObject = {
//     start() {
//         if (!queue.length) { return }
//         time = new Date().getTime()

//         if (Compiler.child) {
//             Compiler.kill('from internal')
//         }

//         // Compiler.child = exec(`node --loader ts-node/esm ${join(thisPath, 'compiler.ts')} --compilerfiles=${JSON.stringify(queue)} --root=${Config.source} --out=${Config.assets} --defaultEntry=${Config.entry}`)

//         // const ac = new AbortController()

//         // Compiler.child = spawn('node', ['--loader', 'ts-node/esm', join(thisPath, 'compiler.ts'), `--compilerfiles=${JSON.stringify(queue)}`], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })
//         // Compiler.child = spawn('node', ['--loader', 'ts-node/esm', join(thisPath, 'compiler.ts'), `--compilerfiles=${JSON.stringify(queue)}`], { shell: true })

//         // Compiler.child.on('message', (msg: string) => {
//         //     if (msg && msg !== ' ') {
//         //         console.log('COMPILER:', msg)
//         //     } else {
//         //         console.log(msg)
//         //     }
//         // })

//         // Compiler.child.on('close', (code: number) => {
//         //     console.log('finished in ', new Date().getTime() - time)
//         //     if (code === 1) { queue = [] }
//         //     Compiler.kill('from close')
//         // })
//         console.log('finished in ', new Date().getTime() - time)
//     },
//     kill(msg = '') {
//         Compiler.child?.unref()
//         const killed = Compiler.child?.kill()
//         console.log('killing', msg, killed, Compiler.child?.killed)
//         // if (Compiler.child) {
//         //     Compiler.child.kill()
//         // } else {
//         //     console.log('No child')
//         // }
//         // Compiler.child?.stdin?.end()
//         // const pid = Compiler.child?.pid
//         // Compiler.child?.kill()

//         // if (pid) {
//         //     try { process.kill(pid) } catch (error) { }
//         // }

//         // setTimeout(() => {
//         //     console.log('killing', msg, Compiler.child?.killed)
//         // }, 2000)
//     },
//     child: null
// }

// function run(filename: string = config.entry) {
//     Compiler.kill('from run')
//     // clearTimeout(timer)

//     if (queue.length && !Compiler.child) { queue = [] }
//     if (queue.indexOf(filename) === -1) { queue.push(filename) }

//     // timer = setTimeout(Compiler.start, 150)
//     Compiler.start()
// }

// export default async function main() {
//     if (shouldServer) { Server(config.static, config.port) }

//     if (shouldCompile) { run() }

//     if (shouldWatch) {
//         watch(resolve(root, Config.source), { recursive: true }, (_kind, filename) => run(resolve(root, Config.source, filename)))
//     }
// }

// main()

// process.on('SIGINT', function () {
//     Compiler.kill('from SIGINT')
//     process.exit()
// })
























// import { join, dirname, normalize, resolve } from 'path'
// import { fork, ChildProcess } from 'child_process'
// import { watch } from 'fs'
// import Server from './server.js'
// import Config from './config.js'


// const processArgs = process.argv.slice(2)
// const shouldServer = processArgs.indexOf('--server') > -1
// const shouldWatch = processArgs.indexOf('--watch') > -1
// const shouldCompile = processArgs.indexOf('--compile') > -1
// const root = resolve('')
// const thisPath = dirname(normalize(import.meta.url.split('file:').join('')))
// const config = Config
// let timer: NodeJS.Timeout
// let queue: string[] = []
// let time = new Date().getTime()

// interface CompilerObject {
//     start: () => void
//     kill: () => void
//     child: null | ChildProcess
// }

// const Compiler: CompilerObject = {
//     start() {
//         if (!queue.length) { return }
//         time = new Date().getTime()
//         if (Compiler.child) { Compiler.child.send('exit') }

//         Compiler.child = fork(join(thisPath, 'compiler.ts'), ['--loader', 'ts-node/esm', `--compilerfiles=${JSON.stringify(queue)}`], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })
//         Compiler.child.on('message', (msg: string) => {
//             if (msg === 'ready' && Compiler.child) {
//                 Compiler.child.send('start')
//             } else if (msg && msg !== ' ') {
//                 console.log('COMPILER:', msg)
//             } else {
//                 console.log(msg)
//             }
//         })
//         Compiler.child.on('exit', (code: number) => {
//             console.log('finished in ', new Date().getTime() - time)
//             if (code === 1) {
//                 queue = []
//                 Compiler.child = null
//             }
//         })
//     },
//     kill() {
//         if (Compiler.child) { Compiler.child.send('exit') }
//     },
//     child: null
// }

// function run(filename: string = config.entry) {
//     clearTimeout(timer)

//     if (queue.length && !Compiler.child) { queue = [] }
//     if (queue.indexOf(filename) === -1) { queue.push(filename) }

//     timer = setTimeout(Compiler.start, 150)
// }

// export default async function main() {
//     if (shouldServer) { Server(config.static, config.port) }

//     if (shouldCompile) { run() }

//     if (shouldWatch) {
//         watch(resolve(root, Config.source), { recursive: true }, (_kind, filename) => run(resolve(root, Config.source, filename)))
//     }
// }

// main()

// process.on('SIGINT', function () {
//     Compiler.kill()
//     process.exit()
// })
