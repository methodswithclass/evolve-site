app.directive("controls", ["utility", "evolve.service", function (u, evolve) {

	return {
		restrict:"E",
		scope:{
			refresh:"=",
			restart:"=",
			step:"=",
			play:"=",
			stop:"="
		},
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, $element, attr) {


			$scope.getContentUrl = function () {

				return "assets/views/evolve-app/components/controls/views/" + u.getInterface() + "/common/controls.html";
			}


		}

	}

}]);