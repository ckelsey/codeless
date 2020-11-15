/** TODO
 * 
 * use v4 graphql instead
 * download all svg's in a repo
 * figure out naming
 * extract path data
 */

import express = require('express')
import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, unlinkSync } from 'fs'
import bodyParser from 'body-parser'
import rimraf from 'rimraf'
import https from 'https'
import { join } from 'path'


const app: express.Application = express()
const port = 1503
const { github } = require(join(__dirname, 'client.json'))
const tmp = join(__dirname, 'tmp')
const createTmp = () => !existsSync(tmp) ? mkdirSync(tmp) : undefined

createTmp()
app.use(express.static(join(__dirname, 'views')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const gitRequest = (path: string, owner: string, repo: string) => new Promise((resolve, reject) => {
    const url = `/repos/${owner}/${repo}/contents/${path.split('/').filter(v => !!v).join('/')}`

    https.request({
        method: 'GET',
        host: 'api.github.com',
        path: url,
        headers: {
            'Accept': 'application/vnd.github.v3+raw',
            'User-Agent': 'Awesome-Octocat-App',
            'Content-Type': 'application/json',
            'Authorization': `token ${github}`
        },
    }, response => {
        const chunks: Uint8Array[] = []
        response
            .on('data', chunk => chunks.push(chunk))
            .on('error', reject)
            .on('close', () => {
                let result = JSON.parse(Buffer.concat(chunks).toString())
                console.log('close result', result)
                resolve(result)
            })
    }).end()
})

app.post('/git', (req, res) => {
    if (!req.body) { return res.json({ success: false, message: 'invalid data' }) }

    const { owner, repo, path } = req.body
    const errors = []
    if (!owner) { errors.push('owner') }
    if (!repo) { errors.push('repo') }
    if (!path) { errors.push('path') }
    if (errors.length) { return res.json({ success: false, message: `invalid: ${errors.join(', ')}` }) }

    gitRequest(path, owner, repo)
        .then(message => res.json({ success: true, message }))
        .catch(message => res.json({ success: false, message }))
})

app.get('/', (_req, res) => res.send(readFileSync(join(__dirname, 'views', 'index.html')).toString()))

https.createServer({ key: readFileSync(join(__dirname, 'localhost.key'), 'utf-8'), cert: readFileSync(join(__dirname, 'localhost.crt'), 'utf-8') }, app).listen(port, () => console.log(`ISON DEV SERVER running on port ${port}`))







// const gitSearchRequest = (_path: string, owner: string, repo: string) => new Promise((resolve, reject) => {
//     const path: string = `/search/code?q=repo:${owner}/${repo}+in:path:${_path.split('/').filter(v => !!v).join('/')}+extension:svg`

//     https.request({
//         path,
//         method: 'GET',
//         host: 'api.github.com',
//         headers: {
//             'Accept': 'application/vnd.github.v3+raw',
//             'User-Agent': 'Awesome-Octocat-App',
//             'Content-Type': 'application/json',
//             'Authorization': `token ${github}`
//         },
//     }, response => {
//         const chunks: Uint8Array[] = []
//         response
//             .on('data', chunk => chunks.push(chunk))
//             .on('error', reject)
//             .on('close', () => {
//                 let result = JSON.parse(Buffer.concat(chunks).toString())
//                 const items = result.items.map((i: any) => ({
//                     name: i.name,
//                     path: i.path,
//                     url: i.git_url
//                 }))
//                 console.log('close result', items.length, items)

//                 resolve(items)
//             })
//     }).end()
// })


