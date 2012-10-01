
var fs = require('fs'),
	path = require('path'),
	follow = require('./followRequires.js'),
	wrap = require('./wrapModule.js'),
	url = require('url'),
	compiler = require('uglify-js').uglify,
	appRoot = '',
	bundles = {},
	packages = {},
	lookup = {},
	uuid = function(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid)}

var BrowserExporter = base.createChild().addInstanceMethods({

	init : function( config){

		if(config.applicationRoot){

			appRoot = config.applicationRoot;

		} else {

			appRoot = __dirname;

		}

		if(config.locals){

			config.locals({browserx : this});

		}

		return this;

	}, 

	middleware : function(){

		return function(req, res, next) {

			// for detecting requests to Javascript.
			if ('GET' != req.method && 'HEAD' != req.method){

				return next();

			}

		    var path = url.parse(req.url).pathname;

		    if ( /^\/browserx\//.test(path) ) {

		    	var v4 = (path.replace('/browserx/', '')).replace('.js', '');

		    	if(!bundles[packages[v4]]){

		    		var bundle = follow.followRequires(packages[v4]);

		    		if(bundle){

		    			bundles[packages[v4]] = wrap.assemble(bundle);

		    		}

		    	}

		    	
		    	res.send(compiler.gen_code( bundles[packages[v4]],{beautify : true} ));


		    } else {

		      next();

		    }

		}

	},


	upload : function( id ){

		var v4;

		if(!lookup[id]){

			// get a meaningful path to the entry point. 

			var usefulPath = path.normalize( __dirname + path.sep + path.relative(__dirname, appRoot) + path.sep + id );

			v4 = uuid();

			packages[v4] = usefulPath;
			
			// get a unique id for the packages..
			lookup[ id ] = v4;

		}else{

			v4 = lookup[id];

		}

		return "<script src='/browserx/" + v4 + ".js' type='text/javascript'></script>";


	}

});

exports = module.exports = BrowserExporter;