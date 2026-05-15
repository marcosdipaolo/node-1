import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}', 'vitest.config.ts', 'eslint.config.mjs'],
    ignores: ['node_modules/**', 'dist/**'],
    ...js.configs.recommended,
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        sourceType: 'module',
      },
      globals: {
        __dirname: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      ...js.configs.recommended.plugins,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
];
