module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    /*'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],*/
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts'] }],
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
};
