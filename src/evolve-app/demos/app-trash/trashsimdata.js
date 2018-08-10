app.directive("trashsimdata", ["utility", function (u) {

	return {
		restrict:"E",
		scope:true,
		replace:true,
        template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, element, attr) {




			var shared = window.shared;
			var g = shared.utility_service;



			$scope.getContentUrl = function () {

				return "assets/views/project-files/ga-apps/app-trash/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/trashsimdata.html";
			}

			
			
		}

	}

}]);