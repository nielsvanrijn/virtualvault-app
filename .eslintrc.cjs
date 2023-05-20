module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:svelte/recommended',
        'plugin:import/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte']
    },
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    overrides: [
        {
            files: ['*.svelte'],
            parser: 'svelte-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
        }
    ],
    rules: {
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'never'],
        'svelte/indent': [
            'error',
            {
                'indent': 4,
            }
        ],
        'svelte/sort-attributes': ['error'],
        'svelte/shorthand-directive': ['error'],
        'svelte/shorthand-attribute': ['error'],
        'svelte/block-lang': ['error', {
            'script': ['ts', null],
        }],
        'import/no-unresolved': 'off',
        'import/order': ['error']
    }
}
