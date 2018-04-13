app.directive("trashsimdata", ["utility", function (u) {

	return {
		restrict:"E",
		scope:true,
		replace:true,
        template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, element, attr) {



			$scope.getContentUrl = function () {

				return "assets/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/trash/trashsimdata.html";
			}



			var shared = window.shared;
			var g = shared.utility_service;

			
			
		}

	}

}]);