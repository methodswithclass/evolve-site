app.factory("loading.service", ["utility", function (u) {


	var shared = window.shared;
	var g = shared.utility_service;
	var events = shared.events_service;
	var react = shared.react_service;
	var send = shared.send_service;


	var $phases;
	var message;

	var $$scope;

	var setMessage = function ($message) {

		$$scope.loadmessage = $message

		$$scope.$apply();
	}

	var runPhase = function (index) {

    	// console.log("run complete index", index);

    	if (index < $phases.length) {

			setTimeout(function () {

        		setMessage($phases[index].message);

        		$phases[index].phase({
        			duration:$phases[index].duration,
        			complete:function () {

        				runPhase(index + 1);
        			}
        		});

    		}, $phases[index].delay);

    	}
    	else {
    		setMessage("");
    	}

	}


    var init = function ($scope, _phases) {

		$phases = _phases;

		$$scope = $scope;

    }



	return {
		init:init,
		runPhase:runPhase
	}


}])