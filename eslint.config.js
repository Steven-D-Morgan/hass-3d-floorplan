// ESLint 9 flat config (replaces .eslintrc.js). The rule set is intentionally
// minimal — the project's TypeScript is loose by design (heavy `any`), so the
// noisy recommended rules are turned off, and we keep the one rule that matters:
// no-cond-assign, which guards against the assignment-vs-comparison class of bug
// that shipped once in v2.3.1.
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  ...tseslint.configs.recommended,
  {
    // The source carries many file-level eslint-disable comments for rules that
    // are turned off globally below; don't flag those as unused.
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    languageOptions: {
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
    },
    rules: {
      'prefer-const': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-cond-assign': ['error', 'always'],
    },
  },
);
