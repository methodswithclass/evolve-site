app.directive("evolveFeedback", ["states", function (states) {


	return {
		scope:{
			position:"@"
		},
		replace:true,
		templateUrl:"assets/views/evolve-app/components/evolving/views/interface1/common/evolve-feedback.html",
	  	link:function ($scope, element, attr) {

	  		// if (angular.isUndefined($scope.position)) {
  			if (!$scope.position) {
	 			$scope.position = "relative";
	 		}

	 		$scope.name = states.getName();

	 		

	  		// console.log("position", $scope.position, "\n\n\n\n\n");
	  	}
	}
}])