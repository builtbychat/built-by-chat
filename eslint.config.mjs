import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/.wrangler/**', 'apps/web/public/**', '**/worker-configuration.d.ts', '**/node_modules/**', 'scripts/**', 'eslint.config.mjs', '**/vitest.config.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error'
    }
  },
  {
    files: ['obs/overlays/**/*.js', 'tools/handoff/**/*.js', 'brand/cursor-explorations/**/*.js', 'brand/identity/**/*.js', 'packages/shared/src/**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: { parserOptions: { projectService: false }, globals: globals.browser }
  }
);
