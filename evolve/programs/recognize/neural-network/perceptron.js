

var perceptron = function (params) {


	var self = this;

	// console.log("create perceptron", params);

	this.layerIndex = params.index;
	this.percepIndex = params.perceptronIndex;
	this.perceptrons = params.numPerceptrons;
	this.numInputs = params.numInputs;
	var inputPerceptron = false;
	if (params.output) {
		inputPerceptron = true;
		this.output = params.output;
	}

	var b = params.bias || 1;
	var inputs = params.inputs || [];
	var weights = params.weights || [];

	this.setOutput = function (_output) {
		inputPerceptron = true;
		this.output = _output;
	}

	this.setBias = function (_bias) {

		b = _bias;
	}

	this.setWeights = function (params) {

		if (params.bias) this.setBias(params.bias);
		if (params.weights) {
			weights = params.weights;
			// this.fire();
		}
		else if (params.index) weights[index] = params.weight
	}

	this.setInputs = function (params) {

		if (params.bias) this.setBias(params.bias);
		if (params.inputs) {
			inputs = params.inputs;
			// this.fire();
		}
		else if (params.index) inputs[index] = params.input;
	}

	this.fire = function () {
		
		var sum = 0;

		for (var i in inputs) {

			if (weights[i]) {
				sum += inputs[i]*weights[i];
			}
		}

		var result = sum + b;

		if (!inputPerceptron) this.output = 1/(1 + Math.exp(-1*result));

		// console.log("fire", inputPerceptron, inputs, weights, sum, b, this.output);

		return this.output;
	}

}


module.exports = {
	perceptron:perceptron
}
