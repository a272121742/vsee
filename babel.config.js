module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
      ],
    }],
  ],
  plugins: [
    [
      'import',
      { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true },
    ],
  ],
};
