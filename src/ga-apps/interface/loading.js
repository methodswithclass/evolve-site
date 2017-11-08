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

			var loadphases = function (phases) {

		        // var loadphase = function (index) {

		        	// console.log("load phase", index);

		        	// loading = true;

		         //    if (index < phases.length) {

		         //        setTimeout(function () {

		                    

		                    // setTimeout(function () {

		                    	// console.log("run phase", index, phases[index].duration);

		                    	// var complete = function () {
		                    	// 	console.log("loading done");
		                    	// }

		                    	// if (index + 1 < phases.length) {
		                    	// 	complete = phases[index+1].phase;
		                    	// }
		                    	// else {
		                    	// 	complete = undefined;
		                    	// }


		                    	var complete = function (index) {

		                    		setTimeout(function () {

			                        	if (index < phases.length) {

			                        		setMessage(phases[index].message);

			                        		phases[index].phase(function () {

			                        			complete(index + 1);
			                        		});
			                        	}

		                        	}, 500);

		                        }

		                        complete(0);

		                        // setTimeout(function () {

		                        //     loadphase(index + 1);

		                        // }, phases[index].duration)

		                    // }, 300);

		                // }, phases[index].delay)
		            // }
		            // else {
		            // 	loading = false;
		            // }

		        // }

		        // loadphase(0);

		    }

		    var load = function () {

		        // running(true);

		        // console.log("inside load", $phases);

		        loadphases($phases);


    		}


    		events.on("load" + $scope.name, function () {

    			// console.log("load", $scope.name);

    			load();
    		})

    	}

    }



}]);