var _ = require('underscore');

var traverse = function(node, visit, onFound){

	visit(node, onFound);

	if(node instanceof Array){
		for(var i = 0, len = node.length; i < len; i++){
			traverse(node[i], visit, onFound);
		}
	}
};

var patternMatch = function(node, test){
	try {
		return test(node);
	}catch(e){
		return false;
	}
};

var detectRequires = function(node, onFound){

	if(patternMatch(node, function(node){
			return node[0] === 'call' &&
				node[1][0] === 'name' &&
				node[1][1] === 'require' &&
				node[2][0][0] === 'string'
											})){

		var userResponse = onFound(node[2][0][1]);

		if(_.isString(userResponse) && !_.isEmpty(userResponse)){

			node[2][0][1] = userResponse;

		}

	}

};

exports.find = function( ast, onFound ){

	traverse(ast, detectRequires, onFound);

	return ast;

}