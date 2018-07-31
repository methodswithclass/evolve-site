app.directive("evolvedata", ["utility", "states", function (u, states) {

	return {
		restrict:"E",
		scope:true,
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {
			


			var shared = window.shared;
			var g = shared.utility_service;
			var react = shared.react_service;


			self.name = u.stateName(states.current());

			$scope.getContentUrl = function () {

				return "assets/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/interface/evolvedata.html";
			}

			
			$scope.evdata = [];
			$scope.stepdata;


			var isDuplicate = function (data) {

				for (var i in $scope.evdata) {

					var evolve = $scope.evdata[i];

					if (evolve.index == data.index) {

						return true;
					}
				}

				return false;
			}

			react.subscribe({
				name:"evdata" + self.name,
				callback:function (x) {



					if (x.evdata && !isDuplicate(x.evdata)) $scope.evdata.push(x.evdata);
					// $scope.stepdata = x.stepdata || $scope.stepdata;
				}
			})

		}

	}

}]);