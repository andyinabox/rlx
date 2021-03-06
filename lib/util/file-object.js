var path = require('path');

function fileobject(file, dir) {
  //console.dir('file: ' + file);
  if(!file) return file;
  var name = path.basename(file);
  var rel = file.replace(dir, '').replace(/^\//, '');
  return {file: file, name: name, path: rel};
}

module.exports = fileobject;
