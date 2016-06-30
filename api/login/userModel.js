var mongoose = require('mongoose');

var userSchema =mongoose.Schema({
name:String,
id:Number,
email : String,
password :String
});


module.exports= mongoose.model('user',userSchema)