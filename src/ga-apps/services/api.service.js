app.factory("display.service", ["utility", "events.service", "global.service", '$http', 'scope.service', function (u, events, g, $http, getScope) {

	var $scope;


	var getCurrentScope = function () {

		$scope = getScope.get();
	}


	var getBest = function (callback) {

		getCurrentScope();


    	$http({
    		method:"GET",
    		url:"/evolve/best/" + $scope.session
    	})
    	.then(function (res) {

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error while getting best individual", err);

        })

    }

    var setStepdata = function (callback) {

    	getCurrentScope();

    	$http({
    		method:"GET",
    		url:"/evolve/stepdata/" + $scope.name + "/" + $scope.session
    	})
    	.then(function (res) {

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error while getting stepdata", err);

        })

   	}

   	var isRunning = function  (callback) {

   		getCurrentScope();

    	$http({
    		method:"GET",
    		url:"/evolve/running/" + $scope.session
    	})
    	.then(function (res) {

    		$scope.running(res.data.running);

			setTimeout(function () {
        	
            	if (update) {
            		isRunning();
            	}
            	else {
		    		completeEvolve();
		    	}

            }, 500)

            if (callback) callback(res);

    	}, function (err) {

    		console.log("Server error while calling 'isRunning'")

    	})

    }


    var instantiate = function (callback) {

    	getCurrentScope();

        $http({
            method:"GET",
            url:"/evolve/instantiate"
        })
        .then(function (res) {

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error while initializing algorithm", err.message);

        })

    }

   	var initialize = function (callback) {

   		getCurrentScope();

        $http({
            method:"POST",
            url:"/evolve/initialize",
            data:{input:$scope.getInput()}
        })
        .then(function (res) {

            console.log("Initialize algorithm", res.data.success);



            if (callback) callback(res);

        }, function (err) {

            console.log("Server error while initializing algorithm", err.message);

        })

    }

    var setInput = function (callback) {

    	getCurrentScope();

    	$http({
    		method:"POST",
    		url:"/evolve/set",
    		data:{input:resend ? $scope.resendInput() : $scope.getInput()}
    	})
    	.then(function (res) {

            console.log("Set input", res);

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error while running algorithm", err);

        })
   	}

    var run = function (callback) {

    	getCurrentScope();

    	$http({
    		method:"POST",
    		url:"/evolve/run", 
    		data:{input:$scope.getInput()}
    	})
    	.then(function (res) {

            console.log("Run algorithm", res);

            if (!res.data.success) {

            	initializeAlgorithmBackend(function () {

            		runEvolveBackend(function  () {

            			if (callback) callback();

            		})

            	});


            }
            else {

            	 if (callback) callback(res);
            }

           

        }, function (err) {

            console.log("Server error while running algorithm", err);

        })
    }


    var refreshEnvironment = function (complete) {

    	getCurrentScope();

        $http({
            method:"POST",
            url:"/trash/environment/refresh/",
            data:{input:$scope.getInput()}
        })
        .then(function (res) {

            if (complete) complete(res);

        }, function (err) {

            console.log("Server error while initializing algorithm", err.message);

        })

    }


    var hardStop = function (callback) {

    	getCurrentScope();

    	$http({
    		method:"POST",
    		url:"/evolve/hardStop",
    		data:{name:$scope.name, input:$scope.getInput()}
    	})
    	.then(function (res) {

            console.log("Hard stop algorithm", res);

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error while running algorithm", err);

        })
    }




	return {
		getBest:getBest,
		setStepdata:setStepdata,
		isRunning:isRunning,
		instantiate:instantiate,
		initialize:initialize,
		setInput:setInput,
		run:run,
		refreshEnvironment:refreshEnvironment,
		hardStop:hardStop
	}

}]);