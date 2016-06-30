var mongoose = require('mongoose');

var technologiesModel = mongoose.Schema({
    id: String,
    name: String    
});

module.exports = mongoose.model('technologies', technologiesModel);