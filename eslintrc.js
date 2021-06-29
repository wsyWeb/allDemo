module.exports = {
    root: true,
    env: {
      node: true
    },
    'extends': [
      'plugin:vue/essential',
      '@vue/standard'
    ],
    rules: {
      'generator-star-spacing': 'off',
      'object-curly-spacing': 'off',
      // 最常出现的错误
      'no-unused-vars': 'off',
      // 最常出现的错误
      "vue/no-use-v-if-with-v-for": ["error", {
        "allowUsingIterationVar": true
      }],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    },
    parserOptions: {
      parser: 'babel-eslint'
    }
  }