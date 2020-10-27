module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    env: {
        'browser': true,
        'es6': true,
        parserOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
        },
        plugins: ['@typescript-eslint'],
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "no-unused-vars": ['error']
    }
};