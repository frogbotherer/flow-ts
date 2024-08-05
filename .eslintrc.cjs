module.exports = {
  extends: ['mantine', 'plugin:react-hooks/recommended', 'plugin:mobx/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
  },
};
