const path = require('path')
const configFile = path.join(__dirname, '..', 'babel.config.js')

module.exports = content => require("@babel/core").transform(
    content,
    {
        filename: 'ts-file.ts',
        configFile
    }).code