app.directive("simulation", ["utility", "states", function (u, states) {

	return {
		restrict:"E",
		scope:true,
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {
			


			var shared = window.shared;
			var g = shared.utility_service;
			var react = shared.react_service;


			
			$scope.getContentUrl = function () {

				return "assets/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/interface/"+$scope.name+"_simulation.html";
			}


   	 		self.name = u.stateName(states.current());

   	 		$scope.name = self.name;


			$scope.evdata;
			$scope.stepdata;

			react.subscribe({
				name:"data" + self.name,
				callback:function (x) {

					$scope.evdata = x.evdata || $scope.evdata;
					$scope.stepdata = x.stepdata || $scope.stepdata;
				}
			})

		}

	}

}]);