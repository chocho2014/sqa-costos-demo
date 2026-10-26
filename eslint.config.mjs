import globals from 'globals';
export default [{ ignores: ['node_modules/**', 'dist/**', 'artifacts/**', 'public/**'] },
  { files: ['src/**/*.cjs', 'test/**/*.cjs', 'quality/**/*.cjs'], languageOptions: { sourceType: 'commonjs', globals: globals.node }, rules: {
    'no-eval': 'error', 'no-implied-eval': 'error', 'no-new-func': 'error', 'no-constant-condition': 'error', 'no-dupe-args': 'error', 'no-unreachable': 'error',
    'complexity': ['warn', 20], 'max-depth': ['warn', 5]
  } },
  { files: ['frontend/**/*.mjs'], languageOptions: { sourceType: 'module', globals: globals.browser }, rules: { 'no-eval': 'error', 'no-new-func': 'error', 'no-unreachable': 'error', 'complexity': ['warn', 20], 'max-depth': ['warn', 5] } }
];
