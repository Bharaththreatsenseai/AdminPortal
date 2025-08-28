/* cSpell: disable */
// @ts-check
import eslint from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import regexpPlugin from 'eslint-plugin-regexp';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import unicornPlugin from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import eslintPluginImportX from 'eslint-plugin-import-x';
import tsParser from '@typescript-eslint/parser';
import securityPlugin from 'eslint-plugin-security';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import drizzle from 'eslint-plugin-drizzle';

// legacy linters
import { fixupPluginRules, fixupConfigRules } from '@eslint/compat';
import fpPlugin from 'eslint-plugin-fp';

export default tseslint.config(
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      jsdoc: jsdocPlugin,
      regexp: regexpPlugin,
      // @ts-ignore
      fp: fixupPluginRules(fpPlugin),
      vue: vuePlugin,
      drizzle,
    },
  },
  {
    ignores: [
      '**/jest.config.js',
      'node_modules/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/fixtures/**',
      '**/coverage/**',
      '**/__snapshots__/**',
      '.nx/*',
      '.turbo/*',
      '.yarn/*',
      '**/.output/*',
      '**/.nuxt/*',
      '**/*.config.js',
      '**/*.config.ts',
      '**/vitest.shared.ts',
    ],
  },

  // extends ...
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  jsdocPlugin.configs['flat/recommended-typescript-error'],
  unicornPlugin.configs['flat/all'],
  prettierPlugin,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  securityPlugin.configs.recommended,
  // @ts-ignore
  ...fixupConfigRules(fpPlugin.configs.recommended),
  perfectionistPlugin.configs['recommended-natural'], //todo enable later
  sonarjsPlugin.configs.recommended,
  // @ts-ignore -- Typings are not in the library yet
  comments.recommended,

  { ignores: ['.prettierrc*'] },

  // base config
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
        parser: tsParser,
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: { reportUnusedDisableDirectives: 2 },

    rules: {
      ...drizzle.configs.recommended.rules,

      //
      // eslint-comments
      //
      '@eslint-community/eslint-comments/require-description': 2,

      //
      // eslint-plugin-perfectionist
      //
      'perfectionist/sort-imports': [2, { newlinesBetween: 'ignore' }],

      //
      // eslint
      //
      //'max-params': [1, 1], /unfortunately not granular enough, and picks up lambdas
      camelcase: [
        2,
        {
          properties: 'always',
          ignoreDestructuring: false,
          ignoreGlobals: false,
          allow: [
            'access_token',
            'id_token',
            'refresh_token',
            'client_id',
            'client_secret',
          ],
        },
      ],
      'no-console': 2,
      'arrow-body-style': [2, 'always'],
      // this rule tend to conflict with prettier
      indent: 0,
      'linebreak-style': [2, 'unix'],
      quotes: [2, 'single', { avoidEscape: true }],
      semi: [2, 'always'],
      'no-trailing-spaces': 1,
      'comma-dangle': [2, 'always-multiline'],
      'no-underscore-dangle': [2, { allow: ['_id', '_path'] }],
      'operator-linebreak': [
        2,
        'after',
        { overrides: { '?': 'before', ':': 'before' } },
      ],
      'max-len': [
        2,
        {
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreComments: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignorePattern: 'href="|@apply|text="',
        },
      ],
      'lines-between-class-members': [
        2,
        'always',
        { exceptAfterSingleLine: true },
      ],
      'object-curly-newline': 0, // disable this (cause issues, and prettier make sure this is consistent anyway)
      //'no-param-reassign': [2, { props: false }], // Make it compatible with vue

      //
      // typescript-eslint
      //
      // prevent empty objects, but allow "abstract" interfaces
      // '@typescript-eslint/no-empty-object-type': [
      //   2,
      //   { allowInterfaces: 'always' },
      // ],
      // flag any variable of function unused, except the ones that start with underscore
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/require-await': 0, // better DX to put async everywhere -> easier refactor
      '@typescript-eslint/explicit-function-return-type': 2,
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true, allowNullish: true },
      ],
      '@typescript-eslint/consistent-indexed-object-style': [
        'error',
        'index-signature',
      ],
      '@typescript-eslint/consistent-type-imports': 2,
      '@typescript-eslint/no-import-type-side-effects': 2,

      //
      // eslint-plugin-unicorn
      //
      'unicorn/no-null': 2,
      'unicorn/no-useless-undefined': 0, // this is in direct clash with consistent-return
      'unicorn/no-for-loop': 1, // to avoid today, and enforce whenever possible
      'unicorn/no-empty-file': 2,
      'unicorn/expiring-todo-comment': 0, // causes issues
      'no-warning-comments': [1, { terms: ['todo', 'fix', 'fixme'] }],
      'unicorn/prevent-abbreviations': [
        // allow to have e2e in filenames, and allow vuejs common names (props, attrs, etc)
        2,
        {
          ignore: ['.*-e2e.*', 'props', 'params', 'vite-env*'],
        },
      ],
      'unicorn/filename-case': [
        2,
        {
          case: 'kebabCase',
          ignore: [
            'App.vue', // don't wan't to deal with that
            'Prose.*\\.vue$', // ignore all the Nuxt-content overrides
          ],
        },
      ],

      //
      // eslint-plugin-import-x
      //
      'import-x/no-default-export': 2,

      //
      // eslint-plugin-fp
      //
      'fp/no-nil': 0, // conflict with unicorn
      'fp/no-unused-expression': 0, // cannot work with our style
      'fp/no-loops': 0, // unicorn is more granular than fp for which loops are allowed
      'fp/no-throw': 0,
      'fp/no-let': 0, // ESlint take care of flagging unused let
      'fp/no-mutating-methods': 0,
      'fp/no-mutation': 0,

      //
      // eslint-plugin-security
      //
      'security/detect-object-injection': 0, // very noisy, kept for CI to help code review

      //
      // eslint-plugin-sonarjs
      //
      'sonarjs/new-cap': 0, // can't edit this, and there are false positives; do this in code reviews
      'sonarjs/todo-tag': 1,
      'sonarjs/cognitive-complexity': 1, // interesting rule, but it should not be disruptive
      'sonarjs/no-small-switch': 1, // remove (use the recommended) when the codebase is more fledged out
      'sonarjs/no-vue-bypass-sanitization': 1, // remove (use the recommended) when the codebase is more fledged out
      'sonarjs/prefer-single-boolean-return': 1, // remove (use the recommended) when the codebase is more fledged out
    },
  },

  ///////////
  // Tests //
  ///////////
  {
    files: ['**/tests/**'],
    rules: {
      'security/detect-non-literal-fs-filename': 0,
      'eslint/security/detect-non-literal-fs-filename': 0,
    },
  },
);