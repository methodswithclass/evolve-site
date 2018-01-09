app.directive("navbtn", ['states', 'display.service', function (states, display) {

	return {
		restrict:"E",
		scope:{
			name:'@',
			loc:'@'
		},
		replace:true,
		template:"<div class='absolute width height pointer z-50'><div class='absolute center'>{{name}}</div></div>",	
		link:function ($scope, element, attr) {


			var hideElements = function () {

				display.toggleElem("evolvedata", "hide");
				display.toggleElem("stage", "hide");
				display.toggleElem("controls", "hide");
				display.toggleElem("simdata", "hide");
				display.toggleElem("settings", "hide");
				display.toggleElem("hud", "hide");

			}


			$(element).on("click", function () {

				console.log("nav to " + $scope.loc);
				
				hideElements();
				
				states.go($scope.loc);
			})

		}

	}

}]);