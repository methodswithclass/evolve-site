app.directive("evolving", ['utility', 'input.service', 'evolve.service', "states", function (u, $input, evolve, states) {

	return {
		restrict:"E",
		scope:{
			run:"=",
			break:"="
		},
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",			
		link:function ($scope, element, attr) {

			var self = this;


			var shared = window.shared;
			var g = shared.utility_service;
			var send = shared.send_service;
			var react = shared.react_service;
			var events = shared.events_service;



   	 		self.name = u.stateName(states.current());

			// console.log("run function", $scope.run);

			$scope.getContentUrl = function () {

				return "assets/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/interface/evolving.html";
			}


			$scope.evdata;
			$scope.stepdata;
			$scope.input;

			react.subscribe({
				name:"data" + self.name,
				callback:function (x) {

					$scope.evdata = x.evdata || $scope.evdata;
					$scope.stepdata = x.stepdata || $scope.stepdata;
					$scope.input = x.input || $scope.input;
				}
			})

		}
	}

}]);