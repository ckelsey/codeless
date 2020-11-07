import express = require('express')
import { join } from 'path'
import { readFileSync } from 'fs'

const app: express.Application = express()
const port = 4057
const distDir = join(__dirname, '..', '..', 'client')

app.use(express.static(distDir))

app.all('*', function (_req, res) {
    res.send(readFileSync(join(distDir, 'index.html')).toString())
});

app.listen(port, function () {
    console.log(`Codeless DEV SERVER running on port ${port}`)
})