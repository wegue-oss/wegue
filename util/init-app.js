const copydir = require('copy-dir');

// keep add time and modify time
// keep file mode
// cover file when exists, default is true
copydir('app-starter', 'app', {
  utimes: true,
  mode: true,
  cover: false
}, function (err) {
  if (err) throw err;
  console.log('done');
});
