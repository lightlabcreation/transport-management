import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const javascriptFiles = ['**/*.{js,mjs,cjs}'];
const typescriptFiles = ['src/**/*.{ts,tsx}', 'vite.config.ts', 'vitest.config.ts'];
const sourceAndConfigFiles = [...javascriptFiles, ...typescriptFiles];
const sourceFiles = ['src/**/*.{js,jsx,ts,tsx}'];
const appConfigFiles = ['src/app/config/**/*.{js,jsx,ts,tsx}'];
const sharedLayerFiles = [
  'src/{assets,components,hooks,lib,mocks,services,store,styles,types,utils}/**/*.{js,jsx,ts,tsx}',
];
const featureFiles = ['src/features/**/*.{js,jsx,ts,tsx}'];

const publicApiImportRestrictions = [
  {
    group: ['@/app/config/*', '@/app/config/**'],
    message: 'Import application configuration from @/app/config.',
  },
  {
    group: ['@/features/*/*', '@/features/*/**'],
    message: 'Import another feature through its public feature root.',
  },
];

const sharedLayerImportRestrictions = [
  ...publicApiImportRestrictions,
  {
    group: ['@/app', '@/app/*', '@/app/**', '@/features', '@/features/*', '@/features/**'],
    message: 'Shared layers must not import application or feature code.',
  },
];

const featureImportRestrictions = [
  ...publicApiImportRestrictions,
  {
    group: ['@/app', '@/app/*', '@/app/**'],
    message: 'Feature code must not import the application layer.',
  },
];

const stableReactHooksRecommendedRules = Object.fromEntries(
  Object.entries(reactHooks.configs.flat.recommended.rules).filter(([ruleName]) =>
    ['react-hooks/rules-of-hooks', 'react-hooks/exhaustive-deps'].includes(ruleName),
  ),
);

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'blob-report/**',
      '**/generated/**',
      '**/.generated/**',
      '**/*.generated.*',
      '**/*.gen.*',
      'docs/**',
      '.agents/**',
      '.git/**',
      '**/*.pdf',
      '**/*.zip',
      'docs.zip',
      'pnpm-lock.yaml',
      'main',
    ],
  },
  {
    files: javascriptFiles,
    extends: [eslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
  {
    files: typescriptFiles,
    extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
    },
  },
  {
    files: sourceAndConfigFiles,
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'prefer-const': 'error',
      eqeqeq: 'error',
      'no-debugger': 'error',
      'no-unreachable': 'error',
      complexity: ['warn', 20],
      'max-lines': [
        'warn',
        {
          max: 500,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...stableReactHooksRecommendedRules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['vite.config.ts', 'vitest.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: sourceFiles,
    ignores: appConfigFiles,
    rules: {
      'no-restricted-imports': ['error', { patterns: publicApiImportRestrictions }],
    },
  },
  {
    files: sharedLayerFiles,
    rules: {
      'no-restricted-imports': ['error', { patterns: sharedLayerImportRestrictions }],
    },
  },
  {
    files: featureFiles,
    rules: {
      'no-restricted-imports': ['error', { patterns: featureImportRestrictions }],
    },
  },
  eslintConfigPrettier,
);
