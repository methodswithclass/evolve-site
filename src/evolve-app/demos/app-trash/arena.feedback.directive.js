app.directive("arenaFeedback", ["utility", "general", function (u, general) {



	return {
		restrict:"E",
		scope:{
			view:"@",
			html:"@",
			message:"@",
			status:"@",
			color:"@",
			refresh:"="
		},
		template:`

			<div ng-if="resolveView()">
				<div ng-include='getContentUrl()'></div>
			</div>


			<div ng-if="!resolveView()">

				<div ng-bind-html="trustHtml(html)"></div>
			</div>


		`,
		link:function ($scope, element, attrs) {


			var shared = window.shared;
			var g = shared.utility_service;
			var react = shared.react_service;

			$scope.getContentUrl = function () {

				return "assets/views/evolve-app/demos/app-trash/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/"+$scope.view;
			}

			$scope.resolveView = function () {

				if (typeof $scope.view === "undefined") {

					return false;
				}
				else if ($scope.view && !$scope.html) {
					return true;
				}


				return $scope.html ? false : true;
			}


			$scope.trustHtml = function (html) {

				return general.renderHtml(html);
			}

		}
	}


}])