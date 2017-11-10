app.directive("loading", ['data', 'utility', 'events.service', 'send.service', 'react.service', function (data, u, events, send, react) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		templateUrl:"assets/views/ga-apps/interface/loading.html",		
		link:function ($scope, element, attr) {

			var $phases;
			var loading = false;

			react.subscribe({
				name:"phases" + $scope.name,
				callback:function (x) {

					$phases = x;

					// console.log("load phases", $phases);

				}
			});

			var setMessage = function (message) {

				// console.log("set message", message);

		        $scope.loadmessage = message;

		        $scope.$apply();
		    }

		    

		    var complete = function (index) {

        		setTimeout(function () {

                	if (index < $phases.length) {

                		setMessage($phases[index].message);

                		$phases[index].phase(function () {

                			complete(index + 1);
                		});
                	}

            	}, 500);

            }


    		events.on("load" + $scope.name, function () {

    			// console.log("load", $scope.name);

    			complete(0);
    			
    		})

    	}

    }



}]);