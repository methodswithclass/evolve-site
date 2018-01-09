app.directive("loading", ['data', 'utility', 'global.service', 'events.service', 'send.service', 'react.service', function (data, u, g, events, send, react) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/loading.html",	
		link:function ($scope, element, attr) {


			// console.log("\n############\ncreate loading directive\n\n");

			var $phases;
			var loading = false;


			var setMessage = function (message) {

				// console.log("set message", message);

		        $scope.loadmessage = message;

		        $scope.$apply();
		    }

		    

		    $scope.runPhase = function (index) {

		    	// console.log("run complete index", index);

		    	if (index < $phases.length) {

        			setTimeout(function () {

                		setMessage($phases[index].message);

                		$phases[index].phase({
                			duration:$phases[index].duration,
                			complete:function () {

                				$scope.runPhase(index + 1);
                			}
                		});

            		}, $phases[index].delay);

            	}
            	else {
            		setMessage("");
            	}

        	}


            $scope.initLoading = function (_phases) {

				$phases = _phases;

            }


    	}

    }



}]);