import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals['shared-node-browser'],
      },

      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',
    },

    rules: {
      'no-dupe-class-members': 'off',
    },
  },
  {
    files: ['**/test/**/*.ts', '**/*.test.ts'],
    rules: {
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];
