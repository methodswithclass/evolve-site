app.directive("evolveFeedback", function () {

	return {
		scope:{
			position:"@"
		},
		templateUrl:"assets/views/evolve-app/components/evolving/views/interface1/common/evolve-feedback.html",
		link:function ($scope, element, attr) {

			if ($scope.position === undefined) {
				$scope.position = "relative";
			}
		}
	}
})