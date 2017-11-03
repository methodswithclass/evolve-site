app.directive('content', ['global.service', function (g) {

	return {
		restrict:'E',
		scope:{
			data:'='
		},
		templateUrl:"assets/views/site/content.html",
		link:function ($scope, element, attr) {
			
			$scope.html = g.renderHtml;

	    }
	}

}]);