app.directive("arenaFeedback", [function () {



	return {
		restrict:"E",
		scope:{
			view:"@",
			html:"@"
		},
		template:`

			<div ng-if="resolveView()">
				<div ng-include='getContentUrl()'></div>
			</div>


			<div ng-if="resolveView()">

				<div ng-bind-html="trustHtml(html)"></div>
			</div>


		`,
		link:function ($scope, element, attrs) {


			$scope.getContentUrl = function () {

				return "assets/views/evolve-app/demos/app-trash/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/feedback/"+$scope.view+".html";
			}

			$scope.resolveHtml = function () {

				if (typeof $scope.view === "undefined") {

					return false;
				}
				else {
					return true;
				}


				

				result = $scope.html ? false : true;
				

				return result;
			}

		}
	}


}])