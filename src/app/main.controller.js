app.controller("main.controller", ['$scope', 'states', 'doc.data', 'config.service', function ($scope, states, dd, config) {


	var shared = window.shared;
	var g = shared.utility_service;


	var self = this;

	var state = states.current()

	self.name = state.charAt(0).toUpperCase() + state.slice(1);

	console.log("open " + state);

	var stateParams;
	$scope.pageParams = {};


	config.get([
	           "config.activePages",
	           "global.programs"
	           ])
	.then((data) => {

		$scope.isActive = data[0];
		
		if (state != "home") {
			stateParams = data[1][state].meta;
			$scope.pageColor = stateParams.colors.page;
			$scope.demoButton = stateParams.colors.demoButton;
		}


		for (var i in data[1]) {
			$scope.pageParams[i] = data[1][i].meta;
		}

	})

	self.overview = dd.get("overview");

	self.doc = dd.get(state);

	self.openDemo = function ($state) {



		states.go(($state ? $state : state) + "#demo");
	}

	self.open = function ($state) {

		states.go($state);
	}

}]);