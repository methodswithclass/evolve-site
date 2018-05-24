app.directive("textInput", ["input.service", function ($input) {



	return {
		restrict:"E",
		replace:true,
		scope:{
			mwId:"@",
			mwClass:"@",
			mwModel:"=",
			mwKeyup:"=",
			validation:"@"
		},
		template:"<input  id='{{mwId}}'   class='{{mwClass}}'   type='text'   ng-model='mwModel' ng-keyup='mwKeyup()' ng-blur='lostFocus()' >",
		link:function ($scope, element, attr) {



			var validTypes = {
				integer:"integer",
				decimal:{
					one:"simgle-decimal",
					two:"double-decimal"
				}
			}

			// console.log("\n\nkeyup", $scope.mwId, $scope.mwKeyup);


			var transformInteger = function (number) {

				$scope.mwModel = Math.floor(number);
			}


			var transformDecimal = function (number, num) {


				$scope.mwModel = Math.floor(Math.pow(10, num)*number)/Math.pow(10, num);
			}


			var setValue = function (value) {


				$($scope.mwId).val(value);
				$($scope.mwId).trigger("input");

				$input.getInput(true);

			}


			$scope.lostFocus = function () {

				console.log("validate input", $scope.validation, $scope.mwModel);

				switch ($scope.validation) {

					case  validTypes.integer:

						transformInteger($scope.mwModel);
					break;

					case  validTypes.decimal.one:

						transformDecimal($scope.mwModel, 1);
					break;

					case validTypes.decimal.two:

						transformDecimal($scope.mwModel, 2);
					break;
				}


				console.log("validated", $scope.mwModel);


				setValue($scope.mwModel);

			}


		}

	}


}])