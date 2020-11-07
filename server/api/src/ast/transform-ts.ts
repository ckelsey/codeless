import { join } from 'path'
import { transformSync } from '@babel/core'

const babelConfig = join(__dirname, '..', '..', '..', 'babel.config.js')

export default function TransformTS(content: string) {
    const transformed = transformSync(
        content,
        {
            filename: 'ts-file.ts',
            configFile: babelConfig
        }
    )
    return transformed && transformed.code ? transformed.code : ''
}