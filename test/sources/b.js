var add = require('./c.js').add;
exports.increment = function(val) {
    add(val, 1);
};