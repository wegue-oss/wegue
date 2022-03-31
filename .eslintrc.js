// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow semicolons and the end of a statement
    'semi': 'off',

    // weaken some rules in development mode
    'no-multiple-empty-lines': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'no-unused-vars': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'space-before-blocks': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'space-before-function-paren': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'object-curly-spacing': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'indent': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'comma-dangle': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'comma-spacing': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'quotes': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'object-curly-spacing': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'padded-blocks': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'keyword-spacing': process.env.NODE_ENV  === 'development' ? 'warn' : 'error',
    'arrow-spacing': process.env.NODE_ENV  === 'development' ? 'warn' : 'error'
  }
}
