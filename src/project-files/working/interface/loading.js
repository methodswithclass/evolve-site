app.directive("loading", ['loading.service', 'utility', function (loading, u) {

	return {
		restrict:"E",
		scope:true,
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {


			$scope.getContentUrl = function () {

				var url = "assets/views/" + u.getInterface() + "/common/interface/loading.html";

				// console.log("retrieve loading html string", url);
				
				return url;
			}

			// console.log("\n\nloading directive\n\n");

			var shared = window.shared;
			var g = shared.utility_service;
			var send = shared.send_service;
			var react = shared.react_service;
			var events = shared.events_service;


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