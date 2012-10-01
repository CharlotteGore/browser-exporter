var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;

exports.buildAST = function( src ){

	return jsp.parse(src);

}

exports.debugCode = function( ast) {

	return pro.gen_code(ast, {beautify : true});

}

exports.productionCode = function( ast) {

	return pro.gen_code( pro.ast_squeeze(pro.ast_mangle(ast)));

}