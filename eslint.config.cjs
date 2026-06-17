// ESLint flat config for ESLint v9+
// Uses @typescript-eslint parser + simple-import-sort for deterministic import ordering
// NOTE: install dev dependencies locally: eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin,
// eslint-plugin-simple-import-sort, eslint-plugin-import, eslint-import-resolver-typescript

module.exports = [
  // ignore common output folders
  {
    ignores: ["node_modules/**", "dist/**", "out-tsc/**"]
  },
  // Typescript files
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
      project: './tsconfig.eslint.json',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      'import': require('eslint-plugin-import')
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      }
    },
    rules: {
      // Use simple-import-sort to auto-fix import order reliably
      'import/order': 'off',
      'simple-import-sort/imports': ['error', {
        'groups': [
          ['^\\u0000'],                                    // side effect imports
          ['^@angular', '^rxjs', '^@?\\w'],                // angular, rxjs, external packages
          ['^@core(/|$)'],                                   // @core alias
          ['^@features(/|$)'],                               // @features alias
          ['^@shared(/|$)'],                                 // @shared alias
          ['^\\.\\.(?!/?$)', '^\\./(?=.*/)(?!/?$)'],    // parent & sibling relative
          ['^\\./?$']                                       // index
        ]
      }],
      'simple-import-sort/exports': 'error',

      // Resolve imports through typescript resolver
      'import/no-unresolved': ['error', { 'caseSensitive': false }],

      // TypeScript specific
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  }
];

