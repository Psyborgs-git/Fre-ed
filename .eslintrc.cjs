module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: '18.3' },
  },
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/display-name': 'off',
    // R3F uses Three.js intrinsic JSX elements (mesh, boxGeometry, etc.) that are
    // not standard React DOM props — disable this rule to avoid false positives.
    'react/no-unknown-property': 'off',
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.config.js', '*.config.cjs', '**/*.mdx'],
};
