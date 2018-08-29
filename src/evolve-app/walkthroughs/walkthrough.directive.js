app.directive("walkthrough", ["utility", "states", "asset.service", function (u, states, assets) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, $element, attr) {


			var s = window.shared;
			var g = s.utility_service;
			var send = s.send_service;
			var react = s.react_service;
			var events = s.events_service;


			self.name = u.stateName(states.current());

			var walkthrough = assets.get(assets.types.WALKTHROUGH, self.name);

			// console.log("run directive \n\n\n\n\n")
			

			events.on("load-display", "walkthrough", function () {


				walkthrough.run();

			});

			$scope.getContentUrl = function () {

				return "assets/views/evolve-app/walkthroughs/" + self.name + "/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/walkthrough.html";
			}


			$scope.run = function () {

				walkthrough.run();
			}


		}

	}

}]);