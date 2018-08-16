app.factory("asset.service", ["trash.controller", "feedback.controller", "recognize.controller", "trash-sim", "feedback-sim", "recognize-sim", "trash.walkthrough", "feedback.walkthrough", "recognize.walkthrough", function (trashController, feedbackController, recognizeController, trashSim, feedbackSim, recognizeSim, trashWalkthrough, feedbackWalkthrough, recognizeWalkthrough) {

	var constants = {
		controller:"controller",
		simulator:"simulator",
		walkthrough:"walkthrough"
	}

	var assets = {
		controller:{
			trash:trashController,
			feedback:feedbackController,
			recognize:recognizeController
		},
		simulator:{
			trash:trashSim,
			feedback:feedbackSim,
			recognize:recognizeSim
		},
		walkthrough:{
			trash:trashWalkthrough,
			feedback:feedbackWalkthrough,
			recognize:recognizeWalkthrough
		}
	}



	var get = function (type, name) {

		return assets[type][name];
	}


	return {
		get:get,
		types:{
			CONTROLLER:constants.controller,
			SIMULATOR:constants.simulator,
			WALKTHROUGH:constants.walkthrough
		}
	}

}])






	