const fs = require('fs');
const glob = require('glob');

glob.sync('./src/**/*.js', { ignore: './src/**/*.test.js'}).forEach(sourcePath => {
  const destPath = `${sourcePath.replace('/src/', '/build/')}.flow`;

  console.log(`${sourcePath} -> ${destPath}`);

  fs.writeFileSync(destPath, fs.readFileSync(sourcePath));
});