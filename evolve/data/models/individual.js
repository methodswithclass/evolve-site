

var mongoose = require("mongoose");
var db = require("../../api/db.js");

var individualSchema = mongoose.Schema({
	index:Number,
	dna:Array,
	fitness:Number,
	runs:Array
})


var Individual = db.model("Individual", individualSchema);


module.exports = Individual;