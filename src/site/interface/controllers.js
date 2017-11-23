app.controller("main.controller", ['$scope', 'states', 'doc.data', 'global.service', function ($scope, states, dd, g) {

	var self = this;

	var sobj = states.split();

	console.log("open " + sobj.program);

	self.overview = dd.get("overview");

	self.doc = dd.get(sobj.program);

	self.open = function (state) {

		states.go(state);
	}

}]);