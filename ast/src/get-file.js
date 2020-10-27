const fs = require('fs')
const path = require('path')

module.exports = url => {
    try {
        return require('fs').readFileSync(require('path').resolve(url)).toString()
    } catch (error) {
        console.log(error)
        return ''
    }
}