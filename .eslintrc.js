module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'max-len': ['error', { code: 120, comments: 140 }],
    'no-bitwise': "off",
    "no-return-assign": "off",
    "no-plusplus": "off",
    "no-param-reassign": "off",
    "class-methods-use-this": "off",
    "no-unused-expressions": "off",
  },
};
