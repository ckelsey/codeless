import http2 from 'http2'
import { readFileSync } from 'fs'
import { basename, join, dirname, normalize, extname } from 'path'

interface GetKeys {
    key: Buffer
    cert: Buffer
}

const thisPath = dirname(normalize(import.meta.url.split('file:').join('')))

const mimeTypes: { [key: string]: string } = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
}

function getKeys(): GetKeys {
    return {
        key: readFileSync(join(thisPath, 'assets', 'server.key')),
        cert: readFileSync(join(thisPath, 'assets', 'server.crt'))
    }
}

export default async function Server(staticDir: string, port: number) {
    const server = http2.createSecureServer(Object.assign({}, getKeys()))
    server.on('error', (err) => console.error(err))

    server.on('stream', (stream, headers) => {
        const requestPath = headers[':path'] || '' as string
        const base = dirname(requestPath) || '/'
        const name = basename(requestPath) || 'index.html'
        const ext = extname(name)
        const contentType = mimeTypes[ext] || 'application/octet-stream'
        const filePath = join(staticDir, base, name)
        let fileData

        try { fileData = readFileSync(filePath).toString() } catch (error) { }

        if (!fileData) {
            stream.respond({ ':status': 404 })
            return stream.end('')
        }

        stream.respond({ 'content-type': `${contentType}; charset=utf-8`, ':status': 200 })
        stream.end(fileData)
    })

    server.listen(port)

    console.log(' ')
    console.log(`Server created at https://localhost:${port}`)
    console.log(' ')

    process.on('SIGINT', function () {
        server.close()
        process.exit()
    })

    return server
}