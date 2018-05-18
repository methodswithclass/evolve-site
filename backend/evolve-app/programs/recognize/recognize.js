
var mongoose = require("mongoose");
var db = require("../../../routes/db.js");
var Image = "../../data/models/Image.js";


var d = require("../../data/programs/recognize.js");
var g = require("mc-shared").utility_service;


var layerFact = require("./neural-network/layer.js");


var recognize = function (options) {

	var self = this;


	var name = "recognize";

	var inputLength = d.data.length;
	var network = d.data.network;
	var dna;
	var net;
	var $dna;
	var runs;
	var bestDNA;

	var $stepdata;

	var geneoffset = options.genemin
	var generange = options.genemax - options.genemin;

	var getTrainImageIndex = function () {

		return Math.floor(Math.random()*28000);
	}


	self.gene = function () {
		
		return Math.random()*generange + geneoffset;
	}

	self.instruct = function ($dna) {

		bestDNA = $dna;
	}

	self.reset = function () {


	}

	var getLayerFromDNA = function (layer) {

		return $dna[layer]
	}

	var getNodeFromLayerOnDNA = function (layer, node) {

		return $dna[layer][node]
	}

	var getWeightFromDNA = function (layer, node, input) {

		return $dna[layer][node][input]["weight"];
	}

	var addLayerToDNA = function (layer) {

		$dna[layer] = {};
	}

	var addNodeToLayerOnDNA = function (layer, node) {

		$dna[layer][node] = {};
	}

	var addWeightToDNA = function (layer, node, input, weight) {

		$dna[layer][node][input] = {weight:weight};
	}

	var makeGenome = function (callback) {

	    // var inputs;
	    // var weights = [];

	    $dna = null;
	    $dna = {};

	    for (var i = 1; i < network.length; i++) {

	    	addLayerToDNA(i);

	        for (var j = 0; j < network[i].nodes; j++) {

	        	addNodeToLayerOnDNA(i, j);

	        	for (var k = 0; k < network[i-1].nodes; k++) {

	        		var gene = callback();
	        		// console.log("gene", gene)
	        		addWeightToDNA(i, j, k, gene);
	        	}

	        }
	        
	    }

	    // console.log("dna", $dna);

	    return $dna;
	}

	var makeNeuralNet = function () {

		var net = [];
		var layer;
		var params;


		for (var i = 0; i < network.length; i++) {

			params = {
				index:i,
				numNodes:network[i].nodes,
				numInputs:(i > 0 ? network[i-1].nodes : 0)
			}

			layer = new layerFact();
			layer.init(params);

			// console.log("make neural net, layer", i, layer.getNodes().length);
			net.push(layer);
		}

		// console.log("make neural net", net.length);

		return net;
	}


	net = makeNeuralNet();

	var assignDNAWeights = function (net, $dna) {

		// console.log("assign weights net", net);
		
		var layer;
		var inputLayer;
		var dnaSegment;
		var node;


		for (var i = 1; i < net.length; i++) {

			layer = net[i];

			for (var j = 0; j < layer.getNodes().length; j++) {

				node = layer.getNode(j);
				inputLayer = net[i-1];

				dnaSegment = [];

				for (var k = 0; k < inputLayer.getNodes().length; k++) {

					dnaSegment.push(getWeightFromDNA(i, j, k))
				}

				// console.log("weights", dnaSegment);

				node.setWeights({weights:dnaSegment});
				layer.setNode(j, node);

			}

			net[i].setLayer(layer.getNodes());

		}

		// console.log("assign weights", net.length);

		return net;
	}

	var assignImageInputs = function (net, input) {


		var prevLayer;
		var layer;

		var inputs = [];

		// console.log("image input", input);
		
		var pixels = net[0].getNodes();

		for (var i in pixels) {

			if (i < input.length) {
				// console.log("image input", input[i]);
				pixels[i].setOutput(input[i]);
			}
		}

		net[0].setLayer(pixels);


		for (var i = 1; i < net.length; i++) { /* each layer */

			prevLayer = net[i-1];

			inputs = [];

			for (var j = 0; j < prevLayer.getNodes().length; j++) {

	        	node = prevLayer.getNode(j);

	        	// console.log("input node fire, layer", i-1, "node", j, "output", node.fire());

	        	inputs.push(node.fire());

	        }

	      	layer = net[i];

			for (var j = 0; j < layer.getNodes().length; j++) {

				node = layer.getNode(j);

				node.setInputs({inputs:inputs});

				layer.setNode(j, node);
			}

			net[i].setLayer(layer.getNodes());
			
		}

		// console.log("assign image inputs", net);

		return net;
		
	}

	var outputFromNeuralNet = function  (net) {

		var node;
		var result = [];
		
		// console.log("output net", net)

		layer = net[net.length-1];

		for (var j in layer.getNodes()) {

			node = layer.getNode(j);

			result.push({
				output:g.truncate(node.fire(), 4),
				index:j
			});
		}

		// console.log("result", result);

		return result;
	}

	self.hardStop = function () {

		runs = 0;
	}

	self.simulate = function (index, complete) {

		// var net = [];
		// var dna = [];
		var output = [];
		// var outputTrun = []
		var label;

		var i = 0;

		// net = makeNeuralNet();
		
		dna = makeGenome(function () {

			return bestDNA[i++]
		});

		net = assignDNAWeights(net, dna);
		var image = d.data.images[index];
		label = image.label;
		net = assignImageInputs(net, image.pixels);
		output = outputFromNeuralNet(net);


		complete(output);
		

	}



	var getFitness = function (output, label) {

		var penalty = 0;
		var reward = 0;

		var correctGuessReward = 40;
		var incorrectGuessPenalty = -50;
		var penaltyPoints = 10;
		var penaltyReversePoints = -20;

		var same = output.find(function (p) {

			return p.index == label
		})

		// console.log("\n\noutput", label, output, same)


		reward = same.output > 0.9 ? correctGuessReward : incorrectGuessPenalty;


		if (reward == correctGuessReward) {

			for (var i in output) {

				if (output[i].index != same.index) {
					penalty += ((output[i].output < 0.01) ? penaltyReversePoints : penaltyPoints);
				}
			}

		}
		else {

			penalty = (-1)*incorrectGuessPenalty;

		}
		


		var fit = reward - penalty;

		// console.log("fit", reward, penalty, fit, "\n\n");

		return fit;

	}

	self.stepdata = function () {

		return $stepdata;
	}

	var performRun = function ($run, fits, params, complete) {

		// console.log("perform run", run, fits);

		var fit = 0;
		var label;
		var output;


		$stepdata = {
			name:"step." + params.input.name,
			gen:params.gen,
			org:params.index,
			run:$run,
			step:1
		}

		var imageIndex = getTrainImageIndex();
		var image = d.data.images[imageIndex];
		label = image.label;
		net = assignImageInputs(net, image.pixels);
		output = outputFromNeuralNet(net);
		fit = getFitness(output, label);
		fits.push({fitness:fit});
		

		// console.log("run", params.gen, params.index, $run, fit);

		if ($run < runs) {
			performRun($run + 1, fits, params, complete);
		}
		else {
			complete(fits);
		}

	}

	self.run = function (params, complete) {

		var fits = [];
		runs = params.input.runs;
		var avg;
		var success;
		var i = 0;


		dna = makeGenome(function () {

			return params.dna[i++]
		});
		net = assignDNAWeights(net, dna);


		performRun(0, fits, params,
		           function (fits) {

						avg = g.truncate(g.average(fits, function (value, index, array) {return value.fitness;}), 2);
						// success = Math.abs(avg - 1) <= 0.01;
						success = false;
						// console.log("success", avg, success)

						complete({
							runs:fits,
							avg:avg,
							success:success
						});

					});

	}


}

module.exports = recognize;



