module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  env: {
    browser: true,
    es6: true,
    commonjs: true,
  },
  extends: [
    'standard',
    'airbnb-base/legacy',
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'babel',
    'import',
    'promise',
    'standard',
    'vue'
  ],
  rules: {
    strict: 2,
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ["error", "single", { "allowTemplateLiterals": true }],
    'semi': ['error', 'always'],
    // 单行最大字符数
    "max-len": 0,
    "no-bitwise": 0,
    "no-use-before-define": ["error", { "functions": false }],
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    "no-void": 0,
    // 函数定义后必须空格
    "space-before-function-paren": ["error", "always"],
    "indent": ["error", 2], // JavaScript代码强制使用一致的缩进：2格缩进
    // 打印语句和调试语句在生产环境报错，其他环境关闭检查
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 1,
    // vue文件的template约束
    "vue/html-indent": ["error", 2],
    "import/no-extraneous-dependencies": 0,
    "import/extensions": 0,
    "no-param-reassign": ["error", { "props": false }],
    "vue/no-parsing-error": [2, {
      "x-invalid-end-tag": false
    }],
    "vue/html-self-closing": 0,
  }
};