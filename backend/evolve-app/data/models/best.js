

var mongoose = require("mongoose");
// var db = require("../../api/db.js");

var bestSchema = mongoose.Schema({
	settings:{
		gens:Number,
		runs:Number,
		goal:String,
		pop:Number,
	},
	generation:Number,
	fitness:Number,
	dna:Array
})


var Best = mongoose.model("Best", bestSchema);


module.exports = Best;