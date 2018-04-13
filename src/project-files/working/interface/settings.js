app.directive("settings", ["utility",function (u) {

	return {
		restrict:"E",
		scope:{
			open:"=",
			changeKind:"=",
			changeInput:"="
		},
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, element, attr) {


			$scope.getContentUrl = function () {

				return "assets/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/interface/settings.html";
			}


			var shared = window.shared;
			var g = shared.utility_service;
			

			
		}
	}

}]);




