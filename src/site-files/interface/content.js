app.directive('content', ['global.service', 'utility', function (g, u) {

	return {
		restrict:'E',
		scope:{
			data:'='
		},
        template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {
			
			$scope.html = g.renderHtml;


			$scope.getContentUrl = function() {
    
				console.log("get interface content", u.getInterface());

		    	return "assets/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/site/content.html";
		    }

	    }
	}

}]);