import express = require('express')
import cors = require('cors')
import bodyParser = require('body-parser')
import { ProjectObject } from '../../src/services/projects'
import { readdirSync, unlinkSync, statSync, existsSync, mkdirSync, writeFileSync, rmdirSync } from 'fs'
import { join, resolve } from 'path'
import { exec } from 'child_process'
import getAst from './ast/get-ast'

const isDir = (path: string) => {
    try {
        return statSync(path).isDirectory()
    } catch (error) {
        return false
    }
}
const projectsDir = resolve('projects')
const getFiles = (path: string) => readdirSync(path).map(name => join(path, name))
const getDirectories = (path: string) => readdirSync(path).map(name => join(path, name)).filter(isDir)

const rmDir = (path: string) => {
    getDirectories(path).map(dir => rmDir(dir))
    getFiles(path).map(file => unlinkSync(file))
    rmdirSync(path)
}

const app: express.Application = express()
const port = 4915
const getProjectPath = (project: ProjectObject) => project.id

let projectServer: any

function shutDown() {
    if (projectServer) {
        projectServer.kill()
    }
}

app.use(cors())
app.options('localhost:4057', cors())
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.get('/project', function (req, res) {
    projectServer = exec(`tsnd --respawn ${join(__dirname, 'project-server.ts')}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`)
            return
        }
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
    })

    res.send('started')
})

app.post('/projects', cors(), function (req, res) {
    const body = req.body || []

    rmDir('./projects')

    if (!existsSync(projectsDir)) { mkdirSync(projectsDir) }

    body.forEach((project: ProjectObject) => {
        const projectPath = join(projectsDir, getProjectPath(project))
        mkdirSync(projectPath)
        writeFileSync(join(projectPath, 'data.json'), JSON.stringify(project))
    })
})

app.get('/ast', function (req, res) {
    const code = req.query.fn as string || ''
    const parser = require('@typescript-eslint/typescript-estree').parse
    const ast = parser(code, {})
    res.json({ success: !!ast, result: ast })
})

app.listen(port, function () {
    console.log(`Codeless API running on port ${port}`)
})

process.on('SIGTERM', shutDown)