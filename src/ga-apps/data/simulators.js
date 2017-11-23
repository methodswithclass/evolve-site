app.factory("simulators", ['feedback-sim', 'trash-sim', 'recognize-sim', function (feedbackSim, trashSim, recognizeSim) {


	var simulators = [
	{
		name:"feedback",
		simulator:feedbackSim
	},
	{
		name:"trash",
		simulator:trashSim
	},
	{
		name:"recognize",
		simulator:recognizeSim
	}
	]

	var get = function (name) {

		var simulator = simulators.find(function (p) {

			return p.name == name;
		})

		return simulator.simulator || {};

	}


	return {
		get:get
	}



}]);