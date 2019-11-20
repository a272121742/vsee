module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    '@vue/standard',
    '@vue/airbnb',
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    strict: 2,
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'always'],
    // 单行最大字符数
    'max-len': 0,
    'no-bitwise': 0,
    'no-use-before-define': ['error', { functions: false }],
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'no-void': 0,
    'func-names': ['error', 'as-needed'],
    'no-nested-ternary': 0,
    // 函数定义后必须空格
    'space-before-function-paren': ['error', 'always'],
    indent: ['error', 2], // JavaScript代码强制使用一致的缩进：2格缩进
    'no-unused-vars': 1,
    'no-shadow': ['error', { hoist: 'functions' }],
    // vue文件的template约束
    'vue/html-indent': ['error', 2],
    'vue/require-component-is': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'no-param-reassign': ['error', { props: false }],
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'vue/html-self-closing': 0,
    'import/no-unresolved': [2, { ignore: ['^~', '^@'] }],
    'no-control-regex': 0,
    'no-case-declarations': 0
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        mocha: true
      }
    }
  ]
};
