app.directive("navbtn", ['states', function (states) {

	return {
		restrict:"E",
		scope:{
			name:'@',
			loc:'@'
		},
		replace:true,
		template:"<div class='absolute width height pointer z-50'><div class='absolute center'>{{name}}</div></div>",	
		link:function ($scope, element, attr) {

			$(element).on("click", function () {

				console.log("nav to " + $scope.loc);

				states.go($scope.loc);
			})

		}

	}

}]);