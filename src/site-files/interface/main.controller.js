app.controller("main.controller", ['$scope', 'states', 'doc.data', 'config.service', function ($scope, states, dd, config) {

	var self = this;


	var shared = window.shared;
	var g = shared.utility_service;
	var send = shared.send_service;
	var react = shared.react_service;
	var events = shared.events_service;



	var state = states.current()

	console.log("open " + state);

	var active = config.get("activePages");

	$scope.open = false;

	self.overview = dd.get("overview");

	self.doc = dd.get(state);

	self.openDemo = function () {

		console.log("clicked open demo", state + "#demo");

		states.go(state + "#demo");
	}

	self.open = function ($state) {

		console.log("clicked open page", $state);

		states.go($state + "#demo");
	}

	self.admin = function () {

		states.go("admin");
	}

	$scope.isActive = active;

}]);