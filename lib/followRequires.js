var f = require('./findRequireRefs').find;
var l = require('./loadFile').loadFile;
var g = require('./ast-helper').buildAST;
var p = require('./ast-helper').debugCode;
var r = require('resolve');
var path = require('path');
var _ = require('underscore');

var modules = [];
var lookups = {};
var trees = {};
var paths = [];

var followRequires;


var processModuleName = function( id ){

	var name = path.basename( id );
	var dir = path.resolve( id.replace( name, '') );

	return {
		module : name,
		dir : dir
	};

};

var traverse = function(moduleName, dir){

	var src = l(dir, moduleName );
	var ast = g( src )

	f(ast, function( ref ){

		if(_.indexOf(paths, dir)===-1){

			paths.push(dir);

		}

		if(!r.isCore(ref)){
			var resolved = r.sync(ref, { paths : paths });

			if(_.indexOf(modules, resolved)===-1){

				modules.push(resolved);

				var t = processModuleName(resolved);

				var newAST = traverse(t.module, t.dir);	

				trees[resolved] = newAST;

			}

			return resolved;

		}else{

			if(_.indexOf(modules, ref)===-1){

				modules.push(ref);

			}

		}

	});

	return ast;

};

exports.followRequires = function(entry){

	// reset the modules;

	modules = [];
	paths = [];
	trees = {};


	// get the name/path of entry..

	var t = processModuleName( entry );

	trees['entry'] = traverse(t.module, t.dir);

	return trees;

};
/*
var h = require('uglify-js').uglify;
var p = require('./lib/followRequires');
var package = p.followRequires('./test/sources/a.js');
*/