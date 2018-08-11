app.directive('content', ['utility', function (u) {

	return {
		restrict:'E',
		scope:{
			data:'='
		},
        template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {
			

			var shared = window.shared;
			var g = shared.utility_service;
			var send = shared.send_service;
			var react = shared.react_service;
			var events = shared.events_service;


			$scope.html = u.renderHtml;


			$scope.getContentUrl = function() {
    
				// console.log("get interface content", u.getInterface());

		    	return "assets/views/app/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/content.html";
		    }

	    }
	}

}]);