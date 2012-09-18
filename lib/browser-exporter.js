var base = require('base-framework'),
	fs = require('fs'),
	parser = require('uglify-js').parser;
	compiler = require('uglify-js').uglify;
	path = require('path'),
	appRoot = '',
	sources = {},
	entry = '';

var BrowserExporter = base.createChild().addInstanceMethods({

	init : function( config ){

		if(config.applicationRoot){

			appRoot = config.applicationRoot;

		} else {

			appRoot = __dirname;

		}

		return this;

	},

	middleware : function(err, req, res, next) {

		// for detecting requests to Javascript. 

	},

	withEntryPoint : function( id ){

		// this should get the absolute path to the entry file javascript.
		var entryPath = path.normalize( __dirname + path.sep + path.relative(__dirname, appRoot) + path.sep + id );

		fs.readFile( entryPath , 'utf8', function( err, data ){

			if(!err){

				try {

					var ast = parser.parse(data);

					sources[entryPath] = ast;

					console.log( compiler.gen_code(sources[entryPath], {beautify : true}));

				}catch(e){

					throw Error(id + "is not a valid javascript file.");
				}

			} else {

				throw Error("Unable to load the entry file. Check the path is correct.");

			}

		});

		// need to be able to find the files. 
		return ViewHelper();

	} 

});

var ViewHelper = base.createChild().addInstanceMethods({

	init : function(){

		return this;

	},

	upload : function( options ){

		// Okay, potential race condition here in that it's possible for this to be called 
		// before we've got bundles sorted.

		return "<script src='/javascript/saltyjavascript.js' type='text/javascript' ></script>";

	}

});


exports = module.exports = BrowserExporter;