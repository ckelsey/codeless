import glob from 'glob'
import { readFileSync } from 'fs'
import { join, resolve } from 'path'

const rootDirectory = resolve('')
const packagePath = glob.sync(join(rootDirectory, '**/package.json'), { ignore: join(rootDirectory, 'node_modules/**/package.json') })[0]

if (!packagePath) { throw Error('Could not find package.json, please create one in the root directory') }

const config = {
    port: 8888,
    https: false,
    source: 'src',
    assets: 'dist',
    static: '',
    entry: 'src/**/*.ts'
}

try { Object.assign(config, JSON.parse(readFileSync(packagePath).toString()).development) } catch (error) { }

const Config = config

export default Config