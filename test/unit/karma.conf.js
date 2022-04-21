// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('../../build/webpack.test.conf');

// Optionally override the specfile index.js
// Idea from: https://glebbahmutov.com/blog/debugging-karma-unit-tests/
var specFile = './index.js';
const preprocessors = ['webpack', 'sourcemap'];
var preprocessorFiles = { './index.js': preprocessors };

const argSpecFileIndex = process.argv.indexOf('--spec-file');
if (argSpecFileIndex > -1) {
  specFile = process.argv[argSpecFileIndex + 1];
  preprocessorFiles = {};
  preprocessorFiles[specFile] = preprocessors;
}

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage'],
    files: [specFile],
    preprocessors: preprocessorFiles,
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    browserConsoleLogOptions: {
      level: 'log'
    }
  })
}
