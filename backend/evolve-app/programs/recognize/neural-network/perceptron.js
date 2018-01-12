

var perceptron = function (params) {


	var self = this;

	// console.log("create perceptron", params);

	var layerIndex = params.index;
	var nodeIndex = params.nodeIndex;
	var numInputs = params.numInputs;
	
	var inputs = params.inputs || [];
	var weights = params.weights || [];

	var inputNode = false;
	var $output;
	var sum = 0;
	
	if (params.output) {
		inputNode = true;
		$output = params.output;
	}


	self.isInput = function () {

		return inputNode;
	}

	self.getLayerIndex = function () {

		return layerIndex;
	}

	self.getIndex = function () {

		return nodeIndex;
	}

	self.getNumInputs = function () {

		return numInputs;
	}

	self.setOutput = function (_output) {
		inputNode = true;
		$output = _output;
	}

	self.setWeights = function (_params) {

		// if (params.bias) this.setBias(params.bias);
		if (_params.weights) {
			weights = _params.weights;
		}
		else if (_params.index && _params.weight) {
			weights[_params.index] = _params.weight
		}
		else {
			for (var i = 0; i < self.numInputs; i++) {
				weights.push(0);
			}
		}

	}

	self.getWeights = function () {

		return weights;
	}

	self.getInputs = function () {

		return inputs;
	}

	self.getOutput = function () {

		return $output;
	}

	self.getSum = function () {

		return sum;
	}

	self.setInputs = function (_params) {

		if (_params.inputs) {
			inputs = _params.inputs;
		}
		else if (_params.index && _params.input) {
			inputs[_params.index] = _params.input;
		}
		else {
			for (var i = 0; i < self.numInputs; i++) {
				inputs.push(0);
			}
		}
	}

	self.fire = function () {
		
		
		if (!inputNode) {
			
			for (var i in inputs) {

				if (weights[i]) {
					sum += inputs[i]*weights[i];
				}
			}
			
			$output = 1/(1 + Math.exp(-1*sum));
		}

		return $output;
	}

}


module.exports = perceptron;
