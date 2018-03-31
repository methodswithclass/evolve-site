app.controller("admin.controller", ['$scope', 'states', 'doc.data', 'global.service', 'config.service', "utility", function ($scope, states, dd, g, config, u) {

	var self = this;

	var state = states.current();

	$scope.data = [
	{
		id:"interface1",
		title:"Interface 1"
	},
	{
		id:"interface2",
		title:"Interface 2"
	}
	]
	
	$scope.interfaceType = "interface1";



	self.set = function () {

		console.log("set interface to", $scope.interfaceType);

		u.setInterface($scope.interfaceType);

		states.go("home");
	}


}]);