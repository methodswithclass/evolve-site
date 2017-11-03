

var d = require("../../../data/programs/recognize.js");
var perceptronFact = require("./perceptron.js").perceptron;


var layer = function () {

	var self = this;


	var perceptrons = [];
	var i = 0;
	var perceptron;

	this.init = function (params) {



		this.perceptrons = params.numPerceptrons;
		this.index = params.index;

		i = 0;

		while (i < this.perceptrons) {

			params.perceptronIndex = i;

			perceptron = new perceptronFact(params);

			perceptrons.push(perceptron);

			i++
		}

	}

	this.setLayer = function ($perceptrons) {

		perceptrons = $perceptrons;
	}

	this.getLayer = function () {

		return perceptrons;
	}

}


module.exports = {
	layer:layer
}