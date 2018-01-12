

var d = require("../../../data/programs/recognize.js");
var perceptronFact = require("./perceptron.js");


var layer = function () {

	var self = this;


	var perceptrons = [];
	var i = 0;
	var perceptron;

	self.init = function (params) {



		self.nodes = params.numNodes;
		self.index = params.index;

		i = 0;

		while (i < self.nodes) {

			params.nodeIndex = i;
			perceptron = new perceptronFact(params);
			perceptrons.push(perceptron);

			i++
		}

	}

	self.setLayer = function ($perceptrons) {

		perceptrons = $perceptrons;
	}

	self.setNode = function (i, node) {

		perceptrons[i] = node;
	}

	self.getNodes = function () {

	 	return perceptrons;
	}

	self.getNode = function (index) {

		return perceptrons[index];
	}

}


module.exports = layer;