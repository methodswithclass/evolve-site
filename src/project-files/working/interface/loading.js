app.directive("loading", ['global.service', 'loading.service', 'utility', function (g, loading, u) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, element, attr) {


			$scope.getContentUrl = function () {

				return "assets/views/" + u.getInterface() + "/common/interface/loading.html";
			}

			var setMessage = function () {

				// console.log("set message", message);

		        $scope.loadmessage = loading.getMessage();

		        $scope.$apply();
		    }


		 //    var start = function () {


			//     var updateTimer = setInterval(function () {

			//     	setMessage();
			//     }, 30);

			// }

			// var stop = function () {

			// 	clearInterval(updateTimer);
			// 	updateTimer = null;
			// }


			// loading.controlLoading(start, stop);

    	}

    }



}]);