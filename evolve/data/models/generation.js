

var mongoose = require("mongoose");
var db = require("../../api/db.js");
var Individual = require("./individual.js");

var individualSchema = db.model("Individual").schema;

var generationSchema = mongoose.Schema({
	index:Number,
	best:individualSchema,
	worst:individualSchema,
	individuals:[individualSchema]
})

var Generation = db.model("Generation", generationSchema);


module.exports = Generation;