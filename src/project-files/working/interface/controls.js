app.directive("controls", ["utility", "evolve.service", function (u, evolve) {

	return {
		restrict:"E",
		scope:{
			refresh:"=",
			reset:"=",
			step:"=",
			play:"=",
			stop:"="
		},
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, $element, attr) {


			$scope.getContentUrl = function () {

				return "assets/views/" + u.getInterface() + "/common/interface/controls.html";
			}


		}

	}

}]);