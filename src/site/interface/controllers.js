app.controller("main.controller", ['$scope', 'states', 'doc.data', 'global.service', 'config.service', function ($scope, states, dd, g, config) {

	var self = this;

	var sobj = states.split();

	console.log("open " + sobj.program);

	var active = config.get("activePages");

	self.overview = dd.get("overview");

	self.doc = dd.get(sobj.program);

	self.open = function (state) {

		states.go(state);
	}

	$scope.isActive = active;

}]);