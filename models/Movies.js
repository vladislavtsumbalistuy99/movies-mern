var mongoose = require('mongoose');
var schema = mongoose.Schema({
    id: {type: String},
    title: {type: String, required: true},
    year: {type: String, required: true},
    format: {type: String, required: true},
    stars: {type: Array, required: true},
})

schema.index({title:'text'})

module.exports = mongoose.model('Movies',schema)