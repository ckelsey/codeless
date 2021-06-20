const browserSync = require("browser-sync")
let bs

if (process.env.NODE_ENV === 'development') {
    bs = browserSync.create().init({
        server: {
            https: true,
            baseDir: './',
            routes: {},
            middleware: function (req, res, next) {
                if (req.method.toUpperCase() == 'POST') {
                    res.writeHead(200);
                    res.end();
                }
                next();
            }
        },
        port: 3000,
    }, (err, _bs) => {
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