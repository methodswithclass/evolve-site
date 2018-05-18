

var d = require("../../data/programs/feedback.js")
var g = require("mc-shared").utility_service;



var feedback = function () {

	var self = this;

	var spread = d.data.spread;
	var threshold = d.data.threshold;
	var runs;

	var input;

	var $stepdata;


	self.gene = function () {
		return Math.random()*spread.size;
	}



	var checkgene = function (gene) {


		var diff = Math.abs(gene - (1-spread.target)*spread.size);
		var percent = diff/spread.size;

		if (percent < threshold.success.value) {
			return threshold.success.points;
		}
		else if (percent > threshold.fail.value) {
			return threshold.fail.points;
		}

		return 0;

	}


	self.stepdata = function () {

		return $stepdata;
	}


	self.hardStop = function () {

		runs = 0;
	}


	self.run = function (params, complete) {

		var fit = 0;
		var fits = [];
		var genome = params.dna;
		var success = false;

		var runtoggle = {
			log:params.input.log && true,
			debug:params.input.debug && true 
		}

		input = params.input;

		runs = params.input.runs;

		if (runtoggle.log) {
			console.log(" ");
			console.log("run org:", params.index, "gen:", params.gen);
		}

		for (i in genome) {
			fit += checkgene(genome[i]);
		}

		if (fit >= genome.length*threshold.success.points*0.95) {
			success = true;
		}

		fits[0] = {fit:fit};

		var avg = g.truncate(g.average(fits, function (value, index, array) {return value.fit;}), 2);


		$stepdata = {
			name:"step." + params.input.name,
			gen:params.gen,
			org:params.index,
			run:1,
			step:1
		}

		complete({
			runs:fits,
			avg:avg,
			success:success
		});

	}

}

module.exports = feedback;


