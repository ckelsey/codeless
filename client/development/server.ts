import browserSync, { create } from "browser-sync"
let bs: browserSync.BrowserSyncInstance | undefined

const server: browserSync.ServerOptions = {
    baseDir: './public',
    routes: {},
    middleware: [function (req: any, res: any, next: any) {
        if (req.method.toUpperCase() == 'POST') {
            res.writeHead(200)
            res.end()
        }
        next()
    }]
}
const options: browserSync.Options = {
    https: true,
    server,
    port: 3000,
}

if (process.env.NODE_ENV === 'development') {
    bs = create().init(options, (err, _bs) => {
        if (err) {
            console.log('BROWSER SYNC ERROR', err)
        } else {
            console.log('BROWSER SYNC STARTED')
        }
    })
}

process.on('SIGINT', () => {
    console.log('Killing server...')
    if (bs && bs.exit) { bs.exit() }
})