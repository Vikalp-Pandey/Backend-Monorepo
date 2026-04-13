import js from '@eslint/js';

import globals from 'globals';

import tseslint from 'typescript-eslint';

import prettier from 'eslint-config-prettier';

import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,

  {
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },

    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },

    rules: {
      /**
       * IMPORT SORTING
       */
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Dotenv (e.g. import 'dotenv/config')
            ['^\\u0000dotenv', '^dotenv', '^@repo/env', '^@/db', '^@/env'],

            // Node builtins
            ['^node:'],

            // React & core libraries
            ['^react$', '^react-dom$', '^react/'],

            // Node modules (third-party, no alias prefix)
            ['^(?!@repo|@services|@schemas|@/|\\.)@?\\w'],

            // Workspace packages
            ['^@repo/'],

            // Services
            ['^@services', '^@/services'],

            // Schemas
            ['^@schemas'],

            // Components
            ['^@/components'],

            // Stores
            ['^@/stores'],

            // Hooks
            ['^@/hooks'],

            // Utils / Lib
            ['^@/lib', '^@/utils', '^@/handler'],

            // Routes
            ['^@/routes'],

            // Types (path alias)
            ['^@/types'],

            // Bare `types` module or relative type files
            ['^types$', '^types/'],

            // Relative imports
            ['^\\.'],

            // ── Type-only imports (always last, single group = no blank lines) ──
            [
              '^node:.*\\u0000$',
              '^react.*\\u0000$',
              '^(?!@repo|@services|@schemas|@/|\\.)@?\\w.*\\u0000$',
              '^@repo/.*\\u0000$',
              '^@services.*\\u0000$',
              '^@/services.*\\u0000$',
              '^@schemas.*\\u0000$',
              '^@/components.*\\u0000$',
              '^@/stores.*\\u0000$',
              '^@/hooks.*\\u0000$',
              '^@/lib.*\\u0000$',
              '^@/utils.*\\u0000$',
              '^@/types.*\\u0000$',
              '^types.*\\u0000$',
              '^\\..*\\u0000$',
            ],
          ],
        },
      ],

      'simple-import-sort/exports': 'error',

      /**
       * UNUSED IMPORTS / VARIABLES
       */
      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-unused-vars': 'off',

      /**
       * TYPESCRIPT STRICT RULES
       */
      '@typescript-eslint/no-explicit-any': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],

      '@typescript-eslint/ban-ts-comment': 'warn',

      /**
       * GENERAL BEST PRACTICES
       */
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
    },
  },
];
