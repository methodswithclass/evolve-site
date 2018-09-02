app.directive("navbtn", ['states', 'utility', 'evolve.service', function (states, u, evolve) {

	return {
		restrict:"E",
		scope:{
			name:'@',
			loc:'@',
			varClass:'@'
		},
		replace:true,  
		template:"<div class='absolute width height rounded10 shadow font-20 pointer z-50' ng-class='varClass'><div class='absolute center'>{{name}}</div></div>",	
		link:function ($scope, element, attr) {



			var shared = window.shared;
			var g = shared.utility_service;
			var send = shared.send_service;
			var react = shared.react_service;
			var events = shared.events_service;


			// console.log("nav button", $scope.varClass);

			var hideElements = function () {

				u.toggle("hide", "evolvedata", {fade:300});
				u.toggle("hide", "stage", {fade:300});
				u.toggle("hide", "controls", {fade:300});
				u.toggle("hide", "simdata", {fade:300});
				u.toggle("hide", "settings", {fade:300});
				u.toggle("hide", "hud", {fade:300});

			}


			$(element).on("click", function () {

				console.log("nav with", $scope.name, "to", $scope.loc);

				events.dispatch($scope.name + "." + $scope.loc);
				
				hideElements();

				if (evolve.isEvolving()) {
					// console.log("is evolving on exit, break run");
					evolve.breakRun($scope);
				}
				
				states.go($scope.loc);
			})

		}

	}

}]);