app.factory("api.service", ["utility", "events.service", "global.service", '$http', function (u, events, g, $http) {



	var getBest = function ($scope, callback) {

        // return function ($scope, callback) {

        	$http({
        		method:"GET",
        		url:"/evolve/best/" + $scope.session
        	})
        	.then(function (res) {

                callback(res);

            }, function (err) {

                console.log("Server error: 'getBest'", err.message)

            })

        // }

    }


    var stepdata = function ($scope, callback) {

        // return function ($scope, callback) {

        	$http({
        		method:"GET",
        		url:"/evolve/stepdata/" + $scope.name + "/" + $scope.session
        	})
        	.then(function (res) {

                callback(res);

            }, function (err) {

                console.log("Server error: 'stepdata'", err.message)
            })

        // }

   	}


   	var isRunning = function  ($scope, callback) {

        // return function ($scope, callback) {

        	$http({
        		method:"GET",
        		url:"/evolve/running/" + $scope.session
        	})
        	.then(function (res) {

                callback(res);

        	}, function (err) {

        		console.log("Server error: 'isRunning'", err.message)

        	})

        // }

    }


    var setInput = function ($scope, resend, callback) {

        // return function ($scope, resend, callback) {

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

        // }

   	}


    var instantiate = function (callback) {


        // return function (callback) {

            $http({
                method:"GET",
                url:"/evolve/instantiate"
            })
            .then(function (res) {

                if (callback) callback(res);

            }, function (err) {

                console.log("Server error: 'instaniate'", err.message)

            })

        // }


    }


   	var initialize = function ($scope, callback) {

        // return function ($scope, callback) {

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

        // }

    }


    var run = function ($scope, callback) {

        // return function ($scope, callback) {

        	$http({
        		method:"POST",
        		url:"/evolve/run", 
        		data:{input:$scope.getInput()}
        	})
        	.then(function (res) {

                if (!res.data.success) {

                	initialize(function () {
                		
                		run(function  () {
                			if (callback) callback(res);
                		})
                	});
                }
                else {

                	 if (callback) callback(res);
                }

            }, function (err) {

                console.log("Server error: 'run'", err.message)
            })

        // }

    }

     var instruct = {

        trash:function (session, callback) {

            // return function (session, callback) {

            $http({
                method:"GET",
                url:"/evolve/instruct/trash/" + session
            })
            .then(function (res) {

                if (callback) callback(res);

            }, function (err) {

                console.log("Server error: 'instruct'", err.message);

            })


        },
        recognize:function (session, callback) {

            $http({
                method:"GET",
                url:"/evolve/instruct/recognize/" + session
            })
            .then(function (res) {

                console.log("instruct successful", res.body);

                if (callback) callback(res);

            }, function (err) {

                console.log("Server error while running best individual", err);

            })

        }

    }

    var refreshEnvironment = function ($scope, callback) {

        // return function ($scope, callback) {

            $http({
                method:"POST",
                url:"/trash/environment/refresh/",
                data:{input:$scope.getInput()}
            })
            .then(function (res) {

                if (callback) callback(res);

            }, function (err) {

                console.log("Server error: 'refresh environment'", err.message)

            })

        // }

    }

    var resetEnvironment = function (session, callback) {

        // return function (session, callback) {

            $http({
                method:"GET",
                url:"/trash/environment/reset/" + session
            })
            .then(function (res) {

                if (callback) callback(res);

            }, function (err) {

                console.log("Server error: 'reset environment'", err.message)

            })

        // }

    }


    var simulate = {


        trash:function (input, callback) {

        // return function (input, callack) {

            $http({
                method:"POST",
                url:"/trash/simulate",
                data:input
            })
            .then(function (res) {

                if (callback) callback(res);

            }, function (err) {

                console.log("Server error: 'simulate'", err.message);
            })

        // }

        },
        recognize:function (session, callback) {

            $http({
                method:"POST",
                url:"/recognize/simulate/" + session
            })
            .then(function (res) {

                if (callback) callback(res);

            }, function (err) {

                console.log("Server error while running best individual", err);

            })
    }

}


    var hardStop = function ($scope, callback) {


        // return function ($scope, callback) {

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

        // }
    }

	return {
		getBest:getBest,
		stepdata:stepdata,
		isRunning:isRunning,
		instantiate:instantiate,
		initialize:initialize,
		setInput:setInput,
		run:run,
        instruct:instruct,
		refreshEnvironment:refreshEnvironment,
        resetEnvironment:resetEnvironment,
        simulate:simulate,
		hardStop:hardStop
	}

}]);