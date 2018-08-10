app.directive("simulation", ["utility", "states", function (u, states) {



	var shared = window.shared;
	var g = shared.utility_service;
	var react = shared.react_service;

	return {
		restrict:"E",
		scope:true,
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {


			
			$scope.getContentUrl = function () {

				return "assets/views/project-files/ga-apps/app-" + $scope.name + "/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/simulation.html";
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