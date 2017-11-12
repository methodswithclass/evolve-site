app.directive('content', ['global.service', function (g) {

	return {
		restrict:'E',
		scope:{
			data:'='
		},
        template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {
			
			$scope.html = g.renderHtml;


			$scope.getContentUrl = function() {
    
		        var view;

		        if (g.isMobile()) {

		            view = "assets/views/mobile/site/content.html";
		        }
			    else {
			        view = "assets/views/desktop/site/content.html";
			    }

		        return view;
		    }

	    }
	}

}]);