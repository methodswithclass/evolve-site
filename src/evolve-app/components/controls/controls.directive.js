app.directive("controls", ["utility", "states", "controls.service", function (u, states, control) {

	return {
		restrict:"E",
		scope:{
			refresh:"=",
			restart:"=",
			step:"=",
			play:"=",
			stop:"="
		},
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, $element, attr) {


			var s = window.shared;
			var g = s.utility_service;
			var send = s.send_service;
			var react = s.react_service;
			var events = s.events_service;


			self.name = u.stateName(states.current());


			$scope.getContentUrl = function () {

				return "assets/views/evolve-app/components/controls/views/" + u.getInterface() + "/common/controls.html";
			}

		}

	}

}]);