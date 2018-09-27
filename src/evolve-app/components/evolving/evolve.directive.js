app.directive("evolving", ['utility', 'input.service', 'evolve.service', "states", function (u, $input, evolve, states) {

	return {
		restrict:"E",
		scope:{
			break:"=",
			feedback:"@"
		},
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {

			var self = this;

			// console.log("feedback", $scope.feedback, "\n\n\n\n\n");

			var shared = window.shared;
			var g = shared.utility_service;
			var react = shared.react_service;



   	 		self.name = u.stateName(states.current());

			
			$scope.getContentUrl = function () {

				return "assets/views/evolve-app/components/evolving/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/evolving.html";
			}


			var fitnessTruncateValue = 2;

			var evalFeedback = function () {

				var tempFeedback = true;

				if ($scope.feedback == "hidden") {
					tempFeedback = false;
				}

				return tempFeedback;
			}
			

			$scope.showFeedback = function () {


				return evalFeedback();
	 		}
			
			$scope.evdata = {};
			$scope.stepdata = {};
			$scope.input = {};
			$scope.fitnessRounded;
			

			react.subscribe({
				name:"data" + self.name,
				callback:function (x) {

					$scope.evdata = x.evdata || $scope.evdata;
					$scope.stepdata = x.stepdata || $scope.stepdata;
					$scope.input = x.input || $scope.input;
					// console.log("stepdata", $scope.stepdata);

					// console.log("evdata", $scope.evdata.best.fitness, "truncate", g.truncate($scope.evdata.best.fitness, 0));

					$scope.evdata.best = $scope.evdata.best ? $scope.evdata.best : {};
					$scope.evdata.best.fitness = $scope.evdata.best.fitness ? $scope.evdata.best.fitness : 0;

		            $scope.fitnessRounded = g.truncate($scope.evdata.best.fitness, fitnessTruncateValue);

		            // $scope.evol/veProgress = 100*g.truncate($scope.stepdata.gen/$scope.input.gens, 0);

		            // console.log("fitnessRounded", $scope.fitnessRounded);

				}
			})

		}
	}

}]);