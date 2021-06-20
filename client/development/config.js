const path = require('path')
const fs = require('fs')

function makeConfig(pathToFile) {
    try { fs.mkdirSync(path.resolve(root, 'tmp')) } catch (error) { }

    fs.writeFileSync(
        path.resolve(root, 'tmp', 'tsconfig.json'),
        JSON.stringify(
            configData(
                pathToFile,
                JSON.parse(
                    fs.readFileSync(path.resolve(root, 'tsconfig.json').toString())
                )
            )
        )
    )
}