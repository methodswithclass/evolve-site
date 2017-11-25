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

			react.subscribe({
				name:"phases" + $scope.name,
				callback:function (x) {

					$phases = x;

					// if (g.isModbile() && !x.mobile) {

					// 	let _phases = [{
					//         message:"this demo has no mobile version", 
					//         delay:0,
					//         duration:0,
					//         phase:function (complete) {

					//             if (complete) complete();

					//         }
					//     }]

					//     $phases = _phases.push($phases[$phases.length-1]);

					// }
				}
			});

			var setMessage = function (message) {

				// console.log("set message", message);

		        $scope.loadmessage = message;

		        $scope.$apply();
		    }

		    

		    var complete = function (index) {

		    	// console.log("run complete index", index);

        		setTimeout(function () {

                	if (index < $phases.length) {

                		setMessage($phases[index].message);

                		$phases[index].phase(function () {

                			complete(index + 1);
                		});
                	}

            	}, 500);

            }


    		events.on("load" + $scope.name, "id", function () {

    			// console.log("load", $scope.name);

    			complete(0);
    			
    		});


    	}

    }



}]);