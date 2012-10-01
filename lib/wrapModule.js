var jsp = require('uglify-js').parser,
	pro = require('uglify-js').uglify,
	fs = require('fs'),
	_ = require('underscore');

// get the initial ASTs...

var wrappers = {
	'module' : fs.readFileSync(__dirname + '/includes/_module_wrap.js', 'utf8'),
	'bundle' : fs.readFileSync(__dirname + '/includes/_bundle_wrap.js', 'utf8'),
	'header' : fs.readFileSync(__dirname + '/includes/_header.js', 'utf8')
}



// turn the ASTs into strings. This is because we want to be able to generate new 
// asts from them without having to re-parse the original source over and over.
_.each(wrappers, function(element, index){
	wrappers[index] = JSON.stringify( jsp.parse(wrappers[index]) );
});


exports.program = jsp.parse('var inc = require(\'increment\').increment;var a = 1;inc(a);console.log(a);');
exports.increment = jsp.parse('var add = require(\'math\').add;exports.increment = function(val) {add(val, 1);};');
exports.math = jsp.parse('exports.add = function() {var sum = 0, i = 0, args = arguments, l = args.length; while (i < l) {sum += args[i++];} return sum;};');
exports.entry = jsp.parse('var run = function(name) {require(name); }; setTimeout(function(){run("program");}, 200);')

exports.header = wrappers.header;

var makeWrapperAST = function(module_name, innerAST){

	var ast = JSON.parse(wrappers.module);

	ast[1][0][1][2][2][1] = module_name;
	ast[1][0][1][3][3] = innerAST[1];

	return ast;

}

var mergeModules = function(modules){

	var ast = JSON.parse(wrappers.bundle);

	var header = JSON.parse(wrappers.header);

	var codeRoot = ast[1][0][1][1][3];

	_.each(header[1], function(block, index){

		codeRoot.push(block);

	})

	_.each(modules, function(element, index){

		if(index!=='entry'){
			codeRoot.push( element[1][0].slice(0) );

		}

	});

	if(modules.entry){

		_.each(modules.entry[1], function(block, index){

			console.log(block);

			codeRoot.push(block);

		});

	}

	return ast;
}

exports.assemble = function(modules){

	var assembly = {};

	_.each(modules, function(ast, id){

		if(id!=='entry'){

		assembly[id] = makeWrapperAST(id, ast);

		}else{

			assembly['entry'] = ast;

		}

	});

	return mergeModules(assembly);

}

/*

all this outputs: 

(function() {
    modules["program"] = function(require, exports) {
        var inc = require("increment").increment;
        var a = 1;
        inc(a);
    };
    modules["increment"] = function(require, exports) {
        var add = require("math").add;
        exports.increment = function(val) {
            add(val, 1);
        };
    };
    modules["math"] = function(require, exports) {
        exports.add = function() {
            var sum = 0, i = 0, args = arguments, l = args.length;
            while (i < l) {
                sum += args[i++];
            }
            return sum;
        };
    };
})();



var r = require('./lib/wrapModule.js')
var bundle = {'program': r.program, 'math' : r.math, 'increment' : r.increment, 'entry' : r.entry};
var u = require('uglify-js').uglify
var assembled = r.assemble(bundle);
var fs = require('fs');
fs.writeFileSync( 'output.js', u.gen_code(assembled, {beautify : true}), 'utf8');


*/