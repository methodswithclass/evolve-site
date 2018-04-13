app.controller("admin.controller", ['$scope', 'states', 'doc.data', 'config.service', "utility", function ($scope, states, dd, config, u) {

	var self = this;



	var shared = window.shared;
	var g = shared.utility_service;
	var send = shared.send_service;
	var react = shared.react_service;
	var events = shared.events_service;



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