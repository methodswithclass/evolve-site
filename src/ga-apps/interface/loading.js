app.directive("loading", ['global.service', 'loading.service', function (g, loading) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/loading.html",	
		link:function ($scope, element, attr) {


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