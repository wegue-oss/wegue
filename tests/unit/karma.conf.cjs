// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-vite
//   https://github.com/credred/karma-vite

const path = require('path');
const projectRoot = path.resolve(__dirname, '../../');

// Optionally override the specfile index.js
// Idea from: https://glebbahmutov.com/blog/debugging-karma-unit-tests/
let specFile = 'index.js';
const fileList = [{
  pattern: path.resolve(__dirname, specFile),
  type: 'module',
  watched: false,
  served: false
}];

const argSpecFileIndex = process.argv.indexOf('--spec-file');
if (argSpecFileIndex > -1) {
  specFile = process.argv[argSpecFileIndex + 1];
  fileList[0].pattern = path.resolve(__dirname, specFile);
}

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'sinon-chai', 'vite'],
    reporters: ['spec', 'coverage'],
    basePath: projectRoot,
    files: fileList,
    preprocessors: {},
    client: {
      mocha: {
        reporter: 'html'
      }
    },
    vite: {
      root: projectRoot,
      logLevel: 'debug',
      server: {
        middlewareMode: true
      }
    },
    coverageReporter: {
      dir: './tests/unit/coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    browserConsoleLogOptions: {
      level: 'log'
    }
  })
};
