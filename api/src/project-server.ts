import express = require('express')
import { readFileSync } from 'fs'
import { join } from 'path'

const app: express.Application = express()
const port = 1115

app.get('/', function (req, res) {
    res.sendFile(join(__dirname, 'index.html'))
})

app.listen(port, function () {
    console.log(`Build app running on port ${port}`)
})
