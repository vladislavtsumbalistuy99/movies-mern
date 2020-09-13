var mongoose = require('mongoose');
var schema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
})

module.exports = mongoose.model('User',schema)