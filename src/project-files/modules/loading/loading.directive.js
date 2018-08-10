app.directive("loading", ['loading.service', 'utility', function (loading, u) {

	return {
		restrict:"E",
		scope:true,
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {



			var shared = window.shared;
			var g = shared.utility_service;


			$scope.getContentUrl = function () {

				var url = "assets/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/interface/loading.html";

				return url;
			}


    	}

    }



}]);