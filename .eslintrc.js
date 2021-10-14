module.exports = {
  root: !0,
  env: {
    browser: !0,
    node: !0
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    '@vue/prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    vueFeatures: {
      filter: !0,
      interpolationAsNonHTML: !1
    }
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off',
    'vue/component-tags-order': [
      1,
      {
        order: [['style', 'template'], 'script']
      }
    ]
  }
}
