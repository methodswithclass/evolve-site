app.directive("evolving", ['global.service', 'utility', 'events.service', 'react.service', 'simulators', "$http", function (g, u, events, react, simulators, $http) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		templateUrl:"assets/views/ga-apps/interface/evolving.html",		
		link:function ($scope, element, attr) {


			var d;
			var simulator = simulators.get($scope.name);
			var totalActions;
			var default_input;
    		var update = false;
		    var ev = false;
		    var latest;
    		$scope.input = {};

    		$scope.evdata = {
		        index:0,
		        best:{},
		        worst:{}
		    }

		    $scope.stepdata = {
		        gen:0,
		        org:0,
		        run:0,
		        step:0
		    }

			$("#breakfeedback").hide();

			var saveToDatabase = function () {


			}

			var setData = function () {

				totalActions = d.data.actions ? d.data.actions.total : 1;
				$scope.goals = d.data.goals;
			}

		    var getData = function () {

		        $http({
		        	method:"GET",
		        	url:"/evolve/data/" + $scope.name
		        })
		        .then(function (res) {

		            console.log("getting data", res.data);

		            d = res.data.data;
		            setData();

		        }, function (err) {

		            // console.log("Server error while getting data", err);

		        })

		    }

		    getData();

		    $scope.evolving = function (_evolve) {
		        ev = _evolve;
		        if (_evolve) $scope.running(_evolve);
		    }
		    
		    $scope.running = function (_run) {
		        update = _run;
		        if (!_run) $scope.evolving(_run);
		    }

		    $scope.resetInput = function ($input) {

		    	// console.log("input", d.data);

		        default_input = $input || {
		            name:$scope.name,
		            gens:100,
		            runs:20,
		            goal:"max",
		            pop:100,
		            evdelay:0,
		            pdata:d.data,
		            newenv:true
		        }

		        $("#gensinput").val(default_input.gens),
		        $("#runsinput").val(default_input.runs),
		        $("#goalinput").val(default_input.goal),
		        $("#popinput").val(default_input.pop);

		    }

		    $scope.getInput = function () {

		    	// console.log("get input", d.data);

		        $scope.input = {
		            name:$scope.name,
		            gens:parseInt($("#gensinput").val()),
		            runs:parseInt($("#runsinput").val()),
		            goal:$("#goalinput").val(),
		            pop:parseInt($("#popinput").val()),
		            evdelay:default_input.evdelay,
		            pdata:d.data,
		            newenv:true
		        }

		        return $scope.input;
		    }

		    $scope.resendInput = function () {

		    	// $scope.input.gen = $scope.stepdata.gen;

		    	return $scope.input;
		    }

		    var setStepdata = function () {


		    	$http({
		    		method:"GET",
		    		url:"/evolve/stepdata/" + $scope.name
		    	})
		    	.then(function (res) {

		    		// console.log("get stepdata", res.data.stepdata);

	                $scope.stepdata = res.data.stepdata ? res.data.stepdata : $scope.stepdata;

	                setTimeout(function () {

	                	if (update) setStepdata();
	                }, 100);

	            }, function (err) {

	                console.log("Server error while getting stepdata", err);

	            })

		   	}

		    var setEvdata = function (x) {
	           	
	           	// console.log("set evdata", x);

	           	$scope.evdata = x;

	           	var fits = [];

	           	for (var i in $scope.evdata.best.runs) {

	           		fits.push({fit:g.truncate($scope.evdata.best.runs[i].fit, 4)});
	           	}

	           	$scope.evdata.best.runs = fits;

	           	var fits = [];

	           	for (var i in $scope.evdata.worst.runs) {

	           		fits.push({fit:g.truncate($scope.evdata.worst.runs[i].fit, 4)});
	           	}

	           	$scope.evdata.worst.runs = fits;

	           	react.push({
	           		name:"ev." + $scope.name,
	           		state:$scope.evdata
	           	});
	        }


	        var uploadLatest = function (complete) {

		    	$http({
		    		method:"POST",
		    		url:"/evolve/latest",
		    		data:{latest:latest}
		    	})
		    	.then(function (res) {

		    		// console.log("get latest generation", res.data);

		    		complete();

	            }, function (err) {

	                console.log("Server error while getting best individual", err);

	            })
		    }

		    var getLatest = function () {


		    	$http({
		    		method:"GET",
		    		url:"/evolve/latest/"
		    	})
		    	.then(function (res) {

		    		// console.log("get latest generation", res.data);

		    		latest = res.data.latest;

	            }, function (err) {

	                console.log("Server error while getting best individual", err);

	            })


		    }


	        var getBest = function () {

	        	// console.log("get best");

		    	$http({
		    		method:"POST",
		    		url:"/evolve/best",
		    		data:{gen:update ? $scope.stepdata.gen : $scope.input.gens}
		    	})
		    	.then(function (res) {

		    		// console.log("get best individuals", res.data);

	                setEvdata(res.data.ext);

	                setTimeout(function () {

	                	if (update) getBest();
	                }, 1000);

	            }, function (err) {

	                console.log("Server error while getting best individual", err);

	            })
		    }

			var stepprogress = function () {

		        var genT = $scope.input.gens;
		        var orgT = $scope.input.pop;
		        var runT = $scope.input.runs;
		        var stepT = totalActions;

		        var gen = $scope.stepdata.gen - 1;
		        var org = $scope.stepdata.org - 1;
		        var step = $scope.stepdata.step || 0;
		        var run = $scope.stepdata.run - 1;

		        var stepP = (step + run*stepT + org*(runT*stepT) + gen*(orgT*runT*stepT))/(stepT*runT*orgT*genT);
		        var runP = (run + org*runT)/runT;
		        var orgP = (org + gen*orgT)/orgT;
		        //var genP = gen/genT;

		        var percent = stepP;

		        if (percent >= 1) {
		            percent = 1;
		        }

		        $("#rundata").css({width:percent*100 + "%"});
		    }

		    setInterval(function () {

		        if (update) {
		            if (ev) {
		                stepprogress();
		            }
		            $scope.$apply();
		        }

		    }, 30);

		    var completeEvolve = function () {

		    	console.log("complete evolve");
		    	$scope.running(false);

		    	//getLatest(function () {});

		    	u.toggle("hide", "evolve", {
		        	fade:600, 
		        	delay:5000,
		        	complete:function () {
			        	$("#breakfeedback").hide();
				    }
				});

		        u.toggle("show", "refresh", {fade:600, delay:600});
		        u.toggle($scope.name == "trash" ? "show" : "hide", "restart", {fade:600, delay:600});
		        u.toggle("show", "play", {fade:600, delay:600});
		        u.toggle($scope.name == "trash" ? "show" : "hide", "step", {fade:600, delay:600});
		        
		        // u.toggle(status == "finished" ? "show" : "hide" , "run", {fade:600, delay:600});

		        setTimeout(function () {
		            $("#evolvedata").animate({color:"#000"}, 600);
		        }, 300);

		        simulator.setup();

		        events.dispatch("refreshenv");
		        console.log("evolving", update);
		    }

		    var isRunning = function  () {


		    	$http({
		    		method:"GET",
		    		url:"/evolve/running"
		    	})
		    	.then(function (res) {

		    		$scope.running(res.data.running);

            		if (update) {
            			 setTimeout(function () {
	                	
		                	isRunning();
		                }, 500)
            		}
            		else {
            			completeEvolve();
            		}

            	}, function (err) {

            		console.log("Server error while checking for evolve complete")

            	})
		    }


		    var setEvolveBackend = function (resend, complete) {

		    	$http({
		    		method:"POST",
		    		url:"/evolve/set",
		    		data:{input:resend ? $scope.resendInput() : $scope.getInput()}
		    	})
		    	.then(function (res) {

	                console.log("Set input", res);

	                complete();

	            }, function (err) {

	                console.log("Server error while running algorithm", err);

	            })
		   	}

		    var runEvolveBackend = function (complete) {


		    	$http({
		    		method:"POST",
		    		url:"/evolve/run", 
		    		data:{input:$scope.getInput()}
		    	})
		    	.then(function (res) {

	                console.log("Run algorithm", res);

	                complete();

	            }, function (err) {

	                console.log("Server error while running algorithm", err);

	            })
		    }


		    var restartEvolveBackend = function (complete) {


	    		$http({
		    		method:"POST",
		    		url:"/evolve/restart", 
		    		data:{input:$scope.getInput()}
		    	})
		    	.then(function (res) {

	                console.log("Restart algorithm", res);

	                complete();

	            }, function (err) {

	                console.log("Server error while running algorithm", err);

	            })

		    	
		    }


		    var breakEvolveBackend = function () {

		    	$http({
		    		method:"GET",
		    		url:"/evolve/hardStop"
		    	})
		    	.then(function (res) {

	                console.log("Hard stop algorithm", res);

	            }, function (err) {

	                console.log("Server error while running algorithm", err);

	            })
		    }

		    var runEvolveComplete = function () {

				isRunning();

				setStepdata();

    			getBest();
		    }


		    events.on("evolve.complete", function () {
		        completeEvolve();
		    });

		    $scope.resetgen = function () {

		        console.log("reset gen");
		        $scope.running(false);
		        $scope.resetInput();
		        $scope.animateRefresh(function () {

		            setEvolveBackend(false, function () {});
		        });
		    }


		    $scope.run = function () {

		        simulator.refresh();
		        $scope.evolving(true);

		        u.toggle("hide", "refresh", {fade:300});
		        u.toggle("hide", "restart", {fade:300});
		        u.toggle("hide", "step", {fade:300});
		        u.toggle("hide", "play", {fade:300});
		        u.toggle("hide", "stop", {fade:300});
		        u.toggle("show", "evolve", {
		            fade:600,
		            delay:600,
		            complete:function () {

		            	if ($scope.stepdata.gen > 0) {
		            		
		            		//uploadLatest(function () {

		            			setEvolveBackend(true, function () {

			            			restartEvolveBackend(function () {

			            				runEvolveComplete();
			            			});

		            			});
		            		//});
		            	}
		            	else {
		            		
		            		runEvolveBackend(function () {

		            			runEvolveComplete() 

		            		});
		            	}
		                
		            }
		        });

		        setTimeout(function () {
		            console.log("animate");
		            $("#evolvedata").animate({color:"#fff"}, 600);
		            $("#evolvedata").addClass("white-t");
		        }, 300);
		    }


		    $scope.stepevolve = function () {

		        $scope.getInput();
		        simulator.reset();
		        $scope.evolving(true);
		        events.dispatch("step");
		    }

		    $scope.breakRun = function () {

		        $scope.running(false);
		        $("#breakfeedback").show();
		        $scope.input.gens = $scope.stepdata.gen;
		        $("#gensinput").val($scope.input.gens);

		        breakEvolveBackend();

		        completeEvolve();
		    }
		}
	}

}]);