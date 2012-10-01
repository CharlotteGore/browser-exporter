module.exports = function(){
	var inc = require("increment").increment;
	var a = 1;
	a = inc(a);
	console.log(a);
}