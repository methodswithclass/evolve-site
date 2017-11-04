

var d = require("../../data/programs/recognize.js");
var layerFact = require("./neural-network/layer.js").layer;
var g = require("mc-shared").utility_service;

var mongoose = require("mongoose");
var db = require("../../api/db.js");
var Image = "../../data/models/Image.js";

var name = "recognize";

var inputLength = d.data.length;
var dna;
var net;
var $dna;
var runs;
var bestDNA;

var $stepdata;

var getTrainImageIndex = function () {

	return Math.floor(Math.random()*28000);
}


var gene = function () {
	
	return Math.random()*40 - 20;
}

var instruct = function ($dna) {

	bestDNA = $dna;
}

var reset = function () {


}

var makeGenome = function () {

    var inputs;
    var weights = [];
    var $dna = [];
    $dna.push([]);

    for (var i = 1; i < d.data.network.length; i++) {

    	inputs = (i == 1) ? inputLength : d.data.network[i-1].nodes;
        $dna.push([]);

        for (var j = 0; j < d.data.network[i].nodes; j++) {


        	weights = [];
        	$dna[i].push({});

        	for (var k = 0; k < inputs; k++) {
           		weights.push(gene());
           	}

           	$dna[i][j]["weights"] = weights;
        	$dna[i][j]["bias"] = gene();

        }
        
    }

    return $dna;
}

var makeNeuralNet = function () {

	var net = [];
	var layer;
	var params;
	var layers;

	params = {
		index:0,
		numPerceptrons:inputLength,
		numInputs:0,
		output:1
	}

	layer = new layerFact();
	layer.init(params);
	net.push(layer);

	for (var i = 1; i < d.data.network.length; i++) {

		params = {
			index:i,
			numPerceptrons:d.data.network[i].nodes,
			numInputs:d.data.network[i-1].nodes
		}

		layer = new layerFact();
		layer.init(params);
		net.push(layer);
	}

	// console.log("make neural net", net);

	return net;
}


var assignWeights = function (net, $dna) {

	// console.log("assign weights net", net, "$dna", $dna);
	
	var layerArray = [];
	var layer = [];

	var dnaSegment = [];

	for (var i = 1; i < net.length; i++) { /* each layer */

		layerArray = net[i];
		layer = layerArray.getLayer();

		for (var j = 0; j < layer.length; j++) { /* each perceptron in layer */


			perceptron = layer[j];
			dnaSegment = $dna[i-1][j]["weights"];

			// console.log("dnasegment", dnaSegment);

			perceptron.setWeights({weights:dnaSegment, bias:$dna[i-1][j]["bias"]});

			layer[j] = perceptron;

		}

		net[i].setLayer(layer);

	}

	// console.log("assign weights", net);

	return net;
}

var checkImage = function (net, input) {


	var layerArray = [];
	var layer = [];
	var perceptron;

	var inputs = [];

	var prevLayerArray = [];
	var prevLayer;
	var prevPerceptron;

	
	var imageLayer = net[0].getLayer();

	for (var i in imageLayer) {

		if (i < input.length) {
			// console.log("input", input[i]);
			imageLayer[i].setOutput(input[i]);
		}
	}

	net[0].setLayer(imageLayer);


	for (var i = 1; i < net.length; i++) { /* each layer */

		prevLayerArray = net[i-1];
		prevLayer = prevLayerArray.getLayer();

		inputs = [];

		for (var j = 0; j < prevLayer.length; j++) {

        	prevPerceptron = prevLayer[j];

        	// console.log("prev fire", j, prevPerceptron.fire());

        	inputs.push(prevPerceptron.fire());

        }

      	layerArray = net[i];
		layer = layerArray.getLayer();

		for (var j = 0; j < layer.length; j++) {

			perceptron = layer[j];

			perceptron.setInputs({inputs:inputs});
		}

		net[i].setLayer(layer);
		
	}


	layerArray = net[net.length-1];
	layer = layerArray.getLayer();

	var result = [];

	for (var j in layer) {

		perceptron = layer[j];

		result.push({
			output:perceptron.fire(),
			index:j
		});
	}

	// console.log("result", result);

	return result;

	
}

var hardStop = function () {

	runs = 0;
}

var simulate = function (complete) {

	var net = [];
	var dna = [];
	var output = [];
	var outputTrun = []
	var label;

	net = makeNeuralNet();
	dna = d.recognizeArrayToObject(bestDNA);
	net = assignWeights(net, dna);

	var imageIndex = getTrainImageIndex();


	var image = d.data.images[imageIndex];


	label = image.label;
	output = checkImage(net, image.pixels);

	output = output.sort(function (a, b) {

		return b.output - a.output;
	})

	for (var i in output) {
		output[i].outputTrun = g.truncate(output[i].output, 4);
	}

	complete(image.pixels, output, label);
	

}

var getFitness = function (output, expect) {

	var fitness = -20;


	for (var i in expect) {

		if (output[i].output > 0.9 && expect[i] == 1) {

			fitness += 40;

			for (var j in expect) {

				if (j != i && output[j].output > 0.9) {

					fitness -= 2;
				}
			}

			break;
		
		}

	}


	return fitness;

}

var stepdata = function () {

	return $stepdata;
}

var performRun = function (run, fits, params, check, complete) {

	// console.log("perform run", run, fits);

	var fit = 0;
	var label;
	var output;
	var expect = [];

	for (var i = 0; i < 10; i++) {
		expect.push(0);
	}

	$stepdata = {
		name:"step." + name,
		gen:params.gen,
		org:params.index,
		run:run
	}

	var imageIndex = getTrainImageIndex();

	var image = d.data.images[imageIndex];

	label = image.label;
	expect[((label > 0) ? label-1 : Math.abs(label))] = 1;
	output = checkImage(params.net, image.pixels);
	
	fit = getFitness(output, expect);
	
	fits.push({fit:fit});
	
	if (check(run)) {
		performRun(run + 1, fits, params, check, complete);
	}
	else {
		complete(fits);
	}

}

var run = function (params, complete) {

	var fits = [];
	runs = params.input.runs;
	var avg;
	var success;

	net = makeNeuralNet();
	dna = d.recognizeArrayToObject(params.dna);
	net = assignWeights(net, dna);

	params.net = net;

	performRun(1, fits, params, function (run) {

		return run < runs;
	},
	function (fits) {

		avg = g.truncate(g.average(fits, function (value, index, array) {return value.fit;}), 2);
		success = avg > 0.8;

		complete({
			runs:fits,
			avg:avg,
			success:success
		});
	})

}

module.exports = {
	run:run,
	instruct:instruct,
	stepdata:stepdata,
	gene:gene,
	simulate:simulate,
	hardStop:hardStop,
	reset:reset
}


