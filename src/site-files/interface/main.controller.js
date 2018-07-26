app.controller("main.controller", ['$scope', 'states', 'doc.data', 'config.service', function ($scope, states, dd, config) {


	var shared = window.shared;
	var g = shared.utility_service;


	var self = this;

	var state = states.current()

	console.log("open " + state);

	config.get("activePages")
	.then((data) => {

		$scope.isActive = data;
	})

	self.overview = dd.get("overview");

	self.doc = dd.get(state);

	self.openDemo = function () {

		states.go(state + "#demo");
	}

	self.open = function ($state) {

		states.go($state);
	}

}]);