app.factory("api.service", ["utility", "events.service", "global.service", '$http', function (u, events, g, $http) {



	var getBest = function ($scope, callback) {


    	$http({
    		method:"GET",
    		url:"/evolve/best/" + $scope.session
    	})
    	.then(function (res) {

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error: 'getBest'", err.message)

        })

    }


    var stepdata = function ($scope, callback) {


    	$http({
    		method:"GET",
    		url:"/evolve/stepdata/" + $scope.name + "/" + $scope.session
    	})
    	.then(function (res) {

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error: 'stepdata'", err.message)
        })

   	}


   	var isRunning = function  ($scope, callback) {


    	$http({
    		method:"GET",
    		url:"/evolve/running/" + $scope.session
    	})
    	.then(function (res) {

            if (callback) callback(res);

    	}, function (err) {

    		console.log("Server error: 'isRunning'", err.message)

    	})

    }


    var setInput = function ($scope, resend, callback) {


    	$http({
    		method:"POST",
    		url:"/evolve/set",
    		data:{input:resend ? $scope.resendInput() : $scope.getInput()}
    	})
    	.then(function (res) {

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error: 'setInput'", err.message)

        })
   	}


    var instantiate = function ($scope, callback) {


        $http({
            method:"GET",
            url:"/evolve/instantiate"
        })
        .then(function (res) {

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error: 'instaniate'", err.message)

        })

    }


   	var initialize = function ($scope, callback) {


        $http({
            method:"POST",
            url:"/evolve/initialize",
            data:{input:$scope.getInput()}
        })
        .then(function (res) {

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error: 'initialize'", err.message)
        })

    }


    var run = function ($scope, callback) {


    	$http({
    		method:"POST",
    		url:"/evolve/run", 
    		data:{input:$scope.getInput()}
    	})
    	.then(function (res) {

            if (!res.data.success) {

            	initialize(function () {
            		
            		run(function  () {
            			if (callback) callback();
            		})
            	});
            }
            else {

            	 if (callback) callback(res);
            }

        }, function (err) {

            console.log("Server error: 'run'", err.message)
        })
    }


    var refreshEnvironment = function ($scope, complete) {


        $http({
            method:"POST",
            url:"/trash/environment/refresh/",
            data:{input:$scope.getInput()}
        })
        .then(function (res) {

            if (complete) complete(res);

        }, function (err) {

            console.log("Server error: 'refresh environment'", err.message)

        })

    }


    var hardStop = function ($scope, callback) {


    	$http({
    		method:"POST",
    		url:"/evolve/hardStop",
    		data:{name:$scope.name, input:$scope.getInput()}
    	})
    	.then(function (res) {

            if (callback) callback(res);

        }, function (err) {

            console.log("Server error: 'hardStop'", err.message)
        })
    }

	return {
		getBest:getBest,
		stepdata:stepdata,
		isRunning:isRunning,
		instantiate:instantiate,
		initialize:initialize,
		setInput:setInput,
		run:run,
		refreshEnvironment:refreshEnvironment,
		hardStop:hardStop
	}

}]);