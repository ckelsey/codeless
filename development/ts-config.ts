import { resolve, join } from 'path'
import { readFileSync } from 'fs'
import glob from 'glob'
import ts from 'typescript'

const root = resolve('')

function configData(source: string, assets: string, defaultEntry: string, pathToFiles: string[] = [], config: { [key: string]: any } = {}) {
    const files = pathToFiles.filter(f => f.split('.').pop() === 'ts')

    return {
        files: files.length ? files : glob.sync(defaultEntry || `${root}/**/*.ts`),
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
                    rootDir: join(root, source),
                    outDir: join(root, assets)
                }
            )
        )
    }
}

function getBaseConfig() {
    return readFileSync(resolve(root, 'tsconfig.json')).toString()
}

export default function tsConfig(source: string, assets: string, defaultEntry: string, pathToFiles: string[]) {
    return configData(
        source, assets, defaultEntry, pathToFiles,
        JSON.parse(getBaseConfig())
    )
}