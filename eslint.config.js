import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      prettier,
    ],
    files: ['**/*.{js,ts,tsx}'],
    ignores: [
      '.eslintrc.cjs',
      'build.js',
      '*.config.ts',
      '*.config.js',
      '*.config.mjs',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      eqeqeq: 'warn',
      'max-params': 'off',
      'no-duplicate-imports': 'warn',
      'no-return-await': 'warn',
      'no-implicit-coercion': 'warn',
      'linebreak-style': ['error', 'unix'],
      'no-useless-constructor': 'off',
      'guard-for-in': 'off',
      'no-void': 'off',
      'react/require-default-props': 'off',
      'no-shadow': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        2,
        { args: 'all', argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
