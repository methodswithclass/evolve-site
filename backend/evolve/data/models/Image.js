

var mongoose = require("mongoose");
// var db = require("../../api/db.js");


var imageSchema = mongoose.Schema({
	index:Number,
	label:Number,
	pixels:Array
})


var Image = mongoose.model("Image", imageSchema);


module.exports = Image;