const fs = require('fs');
const copydir = require('copy-dir');

copydir('app-starter', 'app', {
  utimes: true, // keep add time and modify time
  mode: true, // keep file mode
  cover: false // cover file when exists
}, function (err) {
  if (err) {
    throw err;
  } else {
    // make sure the "app" directory contains the correct README file
    fs.rename('app/app_folder_readme.md', 'app/README.md', function (err) {
      if (err) console.log('ERROR: ' + err);
      console.log('done');
    });
  }
});

