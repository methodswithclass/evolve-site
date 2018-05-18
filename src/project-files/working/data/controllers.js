app.factory("controllers", ['feedback.controller', 'trash.controller', 'recognize.controller', function (feedback_controller, trash_controller, recognize_controller) {


	var controllers = [
	{
		name:"feedback",
		controller:feedback_controller
	},
	{
		name:"trash",
		controller:trash_controller
	},
	{
		name:"recognize",
		controller:recognize_controller
	}
	]

	var get = function (name) {

		var controller = controllers.find(function (p) {

			return p.name == name;
		})

		return controller.controller || {};

	}


	return {
		get:get
	}



}]);