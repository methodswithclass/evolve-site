app.directive("evolving", ['global.service', 'utility', 'events.service', 'react.service', 'simulators', "$http", function (g, u, events, react, simulators, $http) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/evolving.html",		
		link:function ($scope, element, attr) {


			// console.log("\n############\ncreate evolveing directive\n\n");

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



			$scope.setData = function ($d) {

				// console.log("set data", $scope.name, "\n", $d, "\n\n");

				d = $d
				totalActions = d.data.actions ? d.data.actions.total : 1;
				$scope.goals = d.data.goals;
			}

		    $scope.getData = function (complete) {

		    	// console.log("get data");

		        $http({
		        	method:"GET",
		        	url:"/evolve/data/" + $scope.name
		        })
		        .then(function (res) {

		            var $d = res.data.data;


		            // console.log("\nget data response", $scope.name, "\n", $d, "\n\n");

		            complete($d);

		        }, function (err) {

		            // console.log("Server error while getting data", err);

		        })

		    }

		    $scope.getData(function ($d) {

		    	$scope.setData($d);
		    });

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
		            gens:500,
		            runs:15,
		            goal:"max",
		            pop:60,
		            evdelay:0
		        }

		        $("#gensinput").val(default_input.gens),
		        $("#runsinput").val(default_input.runs),
		        $("#goalinput").val(default_input.goal),
		        $("#popinput").val(default_input.pop);

		    }

		    $scope.getInput = function () {

		    	// console.log("get input", d);

		        $scope.input = {
		            name:$scope.name,
		            gens:parseInt($("#gensinput").val()),
		            runs:parseInt($("#runsinput").val()),
		            goal:$("#goalinput").val(),
		            pop:parseInt($("#popinput").val()),
		            evdelay:default_input.evdelay,
		            pdata:d.data,
		            newenv:true,
		            session:$scope.session
		        }

		        return $scope.input;
		    }

		    $scope.resendInput = function () {

		    	// $scope.input.gen = $scope.stepdata.gen;

		    	return $scope.input;
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


		    var getBest = function (complete) {


		    	$http({
		    		method:"GET",
		    		url:"/evolve/best/" + $scope.session
		    	})
		    	.then(function (res) {

	                setEvdata(res.data.ext);

	                if (complete) complete();

	            }, function (err) {

	                console.log("Server error while getting best individual", err);

	            })


		    }

		    var completeEvolve = function (simulate) {

		    	console.log("complete evolve");
		    	console.log("evolving", update);

		    	$scope.running(false);

		    	getBest(function () {

		    		u.toggle("hide", "evolve", {
			        	fade:600, 
			        	delay:2000,
			        	complete:function () {

			        		$scope.running(false);
				        	$("#breakfeedback").hide();

				        	u.toggle("show", "hud", {fade:600});

					        u.toggle("enable", "refresh", {fade:600});
					        u.toggle("enable", "play", {fade:600});
					        if ($scope.name == "trash") u.toggle("enable", "restart", {fade:600});
					        if ($scope.name == "trash") u.toggle("enable", "step", {fade:600});
				        	

					        u.toggle("show", "run", {fade:600});
					        u.toggle("show", "settings", {fade:600});


				        	simulator.setup($scope.session, function () {

					    		simulator.refresh($scope.session); 
					    	});

					    	setTimeout(function () {
					            $("#evolvedata").animate({color:"#000"}, 600);
					        }, 300);

					    }
					});

		    	});


		    }

		    
		    var isRunning = function  () {

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

            	}, function (err) {

            		console.log("Server error while checking for evolve complete")

            	})

		    }

		    var setStepdata = function () {


		    	$http({
		    		method:"GET",
		    		url:"/evolve/stepdata/" + $scope.name + "/" + $scope.session
		    	})
		    	.then(function (res) {

		    		// console.log("get stepdata", res.data.stepdata);

	                $scope.stepdata = res.data.stepdata ? res.data.stepdata : $scope.stepdata;

	                setTimeout(function () {

	                	if (update) setStepdata();
	                }, 0);

	            }, function (err) {

	                console.log("Server error while getting stepdata", err);

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
		    		data:{input:$scope.getInput(), current:$scope.stepdata.gen}
		    	})
		    	.then(function (res) {

	                console.log("Restart algorithm", res);

	                complete();

	            }, function (err) {

	                console.log("Server error while running algorithm", err);

	            })

		    	
		    }


		    var breakEvolveBackend = function (complete) {

		    	$http({
		    		method:"POST",
		    		url:"/evolve/hardStop",
		    		data:{name:$scope.name, input:$scope.getInput()}
		    	})
		    	.then(function (res) {

	                console.log("Hard stop algorithm", res);

	                complete();

	            }, function (err) {

	                console.log("Server error while running algorithm", err);

	            })
		    }

		    var runEvolveComplete = function () {

				isRunning();

				setStepdata();

				simulator.reset($scope.session);
				simulator.refresh($scope.session);
		    }


		    events.on("evolve.complete", "id", function () {
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

		        // simulator.refresh();
		        $scope.evolving(true);


		        u.toggle("hide", "settings", {fade:300});
		        u.toggle("hide", "run", {fade:300});
		        u.toggle("disable", "refresh", {fade:300});
		        u.toggle("disable", "restart", {fade:300});
		        u.toggle("disable", "step", {fade:300});
		        u.toggle("disable", "play", {fade:300});
		        u.toggle("disable", "stop", {fade:300});
		        

		        // u.toggle("hide", "hud", {fade:300});
		        u.toggle("show", "evolve", {
		            fade:600,
		            delay:600,
		            complete:function () {

		            	if ($scope.stepdata.gen > 0) {
		            		

	            			setEvolveBackend(true, function () {

		            			restartEvolveBackend(function () {

		            				runEvolveComplete();
		            			});

	            			});

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
		            $("#evolvepage").animate({color:"#fff"}, 600);
		            $("#evolvepage").addClass("white-t");
		        }, 300);
		    }


		    $scope.stepevolve = function () {

		        $scope.getInput();
		        simulator.reset($scope.session);
		        $scope.evolving(true);
		        events.dispatch("step");
		    }

		    $scope.breakRun = function () {

		        $scope.running(false);
		        $("#breakfeedback").show();
		        $scope.input.gens = $scope.stepdata.gen;
		        $("#gensinput").val($scope.input.gens);

		        breakEvolveBackend(function () {

		        	completeEvolve();

		        });
		    }


		}
	}

}]);