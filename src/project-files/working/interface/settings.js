app.directive("settings", ["utility", "input.service", "states", function (u, input, states) {

	return {
		restrict:"E",
		scope:{
			open:"=",
			changeKind:"=",
			changeInput:"=",
			data:"=",
			methods:"=",
			resetGen:"="
		},
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, element, attr) {


			
			
			var shared = window.shared;
			var g = shared.utility_service;
			var events = shared.events_service;
			var react = shared.react_service;



    		self.name = u.stateName(states.current());


			$scope.getContentUrl = function () {

				return "assets/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/interface/settings.html";
			}

			$scope.model = "";

			$scope.changeMethod = function (method) {

				console.log("change method", $scope.model, method);

				input.changeInput(method);
			}

			$scope.model = "multi-parent";

			
			// var settings;

			// events.on("init-settings", function () {

			// 	settings = input.getSettings(); 

			// 	console.log("\n\nmodel settings $_scope.settings", settings.method);

			// });
		}
	}

}]);




