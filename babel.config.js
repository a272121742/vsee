module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
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
