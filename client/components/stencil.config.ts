import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { readFileSync } from 'fs';

export const config: Config = {
    namespace: 'components',
    outputTargets: [
        {
            type: 'dist',
            esmLoaderPath: '../loader',
        },
        {
            type: 'dist-custom-elements-bundle',
        },
        {
            type: 'docs-readme',
            dir: 'docs'
        },
        {
            type: 'www',
            serviceWorker: null, // disable service workers
        },
    ],
    plugins: [
        sass()
    ],
    devServer: {
        https: {
            cert: readFileSync('myssl.crt', 'utf8'),
            key: readFileSync('myssl.key', 'utf8')
        }
    }
};
