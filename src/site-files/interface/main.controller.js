app.controller("main.controller", ['$scope', 'states', 'doc.data', 'global.service', 'config.service', function ($scope, states, dd, g, config) {

	var self = this;

	var state = states.current()

	console.log("open " + state);

	var active = config.get("activePages");

	$scope.open = false;

	self.overview = dd.get("overview");

	self.doc = dd.get(state);

	self.openDemo = function () {

		states.go(state + "#demo");
	}

	self.open = function ($state) {

		states.go($state);
	}

	$scope.isActive = active;

}]);