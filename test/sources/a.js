var inc = require('./b.js').increment;
var a = require('./folder/d.js');
var e = require('../other_sources/e');
var $ = require('jquery')
inc(a); // 2r.
inc(e);