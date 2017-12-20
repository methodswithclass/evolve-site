

var mongoose = require("mongoose");
// var db = require("../../api/db.js");
var Individual = require("./individual.js");

var individualSchema = mongoose.model("Individual").schema;

var generationSchema = mongoose.Schema({
	index:Number,
	best:individualSchema,
	worst:individualSchema,
	individuals:[individualSchema]
})

var Generation = mongoose.model("Generation", generationSchema);


module.exports = Generation;