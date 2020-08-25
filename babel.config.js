module.exports = {
  presets: [
    [
      '@vue/app',
      {
        polyfills: [],
      },
    ],
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'entry',
      },
    ],
  ],
  plugins: [
    [
      'import',
      { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true },
    ],
  ],
};
