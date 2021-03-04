module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-alert': 'off',
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
    'max-len': ['error', { code: 300 }],
    'linebreak-style': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    indent: 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
