app.directive("loading", ['loading.service', 'utility', function (loading, u) {

	return {
		restrict:"E",
		scope:true,
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {


			

			$scope.getContentUrl = function () {

				var url = "assets/views/" + u.getInterface() + "/common/interface/loading.html";

				return url;
			}




			// var setMessage = function () {

			// 	// console.log("set message", message);

		 //        $scope.loadmessage = loading.getMessage();

		 //        $scope.$apply();
		 //    }

    	}

    }



}]);