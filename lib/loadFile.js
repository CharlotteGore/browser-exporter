var fs = require('fs');
var path = require('path');

exports.loadFile = function(dir, name){

	return fs.readFileSync(dir + path.sep + name, 'utf8');

}