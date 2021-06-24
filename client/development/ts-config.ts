import { resolve, join } from 'path'
import { readFileSync } from 'fs'
import glob from 'glob'
import ts from 'typescript'

export const src = 'src'
export const dist = 'public/dist'
export const srcToDist = (path: string) => path.split(`/${src}/`).join(`/${dist}/`)
const root = resolve('')
const defaultEntry = join(root, src, 'components', '**', '*.ts')

function configData(pathToFile: string = '', config: { [key: string]: any } = {}) {
    const ext = pathToFile.split('.').pop()

    return {
        files: !!pathToFile && ext === 'ts' ? [pathToFile] : glob.sync(defaultEntry),
        options: Object.assign(
            {},
            config.compilerOptions,
            Object.assign(
                {},
                config.compilerOptions,
                {
                    module: ts.ModuleKind[config.compilerOptions.module || 'ESNext'] || ts.ModuleKind.ESNext,
                    target: ts.ModuleKind[config.compilerOptions.module || 'ES2020'] || ts.ModuleKind.ES2020,
                    moduleResolution: ts.ModuleResolutionKind[config.compilerOptions.moduleResolution || 'NodeJs'] || ts.ModuleResolutionKind.NodeJs,
                    rootDir: join(root, src),
                    outDir: join(root, dist)
                }
            )
        )
    }
}

function getBaseConfig() {
    return readFileSync(resolve(root, 'tsconfig.json')).toString()
}

export default function tsConfig(pathToFile: string) {
    return configData(
        pathToFile,
        JSON.parse(getBaseConfig())
    )
}