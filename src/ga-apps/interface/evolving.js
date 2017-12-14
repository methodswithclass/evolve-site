app.directive("evolving", ['global.service', 'utility', 'events.service', 'react.service', 'simulators', "$http", 'display.service', function (g, u, events, react, simulators, $http, display) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/evolving.html",		
		link:function ($scope, element, attr) {


			console.log("\n############\ncreate evolveing directive\n\n");

			
			var simulator = simulators.get($scope.name);
    		var update = false;
		    var ev = false;
    		$scope.input = {};

    		var manual;

    		// var programInput;

    // 		var manual = {
				// gens:{
				// 	default:500,
				// 	current:500,
				// 	check:function (value) {
	 		// 			return value >= 1
	 		// 		}
				// },
				// runs:{
				// 	default:20,
				// 	current:20,
				// 	check:function (value) {
	 		// 			return value >= 1
	 		// 		}
				// },
				// goal:{
				// 	default:"max",
				// 	current:"max",
				// 	check:function (value) {
	 		// 			return value == "min" || value == "max"
	 		// 		}
				// },
				// pop:{
				// 	default:100,
				// 	current:100,
				// 	check:function (value) {
	 		// 			return value >= 5
	 		// 		}
				// },
				// crossover:{
				// 	children:{
    // 					parents:{
    // 						default:2,
    // 						current:2,
    // 						check:function (value) {
				// 				return value >= 2
				// 			}
    // 					},
    // 					pool:{
    // 						default:0.1,
    // 						current:0.1,
    // 						check:function (value) {
				// 				return value >= 0.01
				// 			}
    // 					},
    // 					splicemin:{
    // 						default:2,
    // 						current:2,
    // 						check:function (value) {
				// 				return value >= 1
				// 			}
    // 					},
    // 					splicemax:{
    // 						default:12,
    // 						value:12,
    // 						check:function (value) {
				// 				return value >= 4
				// 			}
    // 					},
    // 					mutate:{
    // 						default:0.02,
    // 						value:0.02,
    // 						check:function (value) {
				// 				return value >= 0
				// 			}
    // 					}
				// 	}
				// },
				// programInput:{
				// 	children:{

				// 	}
				// }
 			// }


		 	// var recursiveRegistry = function (flag, options) {
			    

			 //    var registry = options.registry;
			 // 	var manualdeep = options.manual;

		 	// 	if (flag == "setManual") {


		  //   		for (var i in registry) {

		  //   			console.log("registry", registry, i, registry[i], manualdeep);

		  //   			if (registry[i].current) {

		  //   				if (!manualdeep[i]) manualdeep[i] = {};

		  //   				manualdeep[i].default = registry[i].default;
		  //   				manualdeep[i].current = registry[i].current;
		  //   				console.log("current", registry[i].current, manualdeep[i]); 
		  //   			}
		  //   			else if (registry[i].children) {

		  //   				console.log("registry children", registry[i].children);

		  //   				if (!manualdeep[i]) manualdeep[i] = {}

		  //   				return recursiveRegistry(flag, {manual:manualdeep[i], registy:registry[i].children})
		    				
		  //   			}
		  //   			else {
		  //   				console.log("recursive registry terminated abruptly with no default or children present");
		  //   			}
		    			
		  //   		}

	   //  		}
	   //  		else if (flag == "getChecks") {


		  //   		console.log("registry", registry, i, registry[i], manualdeep);

		  //   		for (var i in registry) {

		  //   			if (registry[i].check) {
		    				
		  //   				if (!manualdeep[i]) manualdeep[i] = {};

		  //   				console.log("current", registry[i].current, manualdeep[i]);
		  //   				manualdeep[i].check = registry[i].check;

		  //   			}
		  //   			else if (registry[i].children) {

		  //   				if (!manualdeep[i]) manualdeep[i] = {};

		  //   				return recursiveRegistry(flag, {manual:manualdeep[i], registy:registry[i].children})
		    				
		  //   			}
		  //   			else {
		  //   				console.log("recursive registry terminated abruptly with no value or children present");
		  //   			}

		  //   		}

	   //  		}
	   //  		else if (flag == "validate") {

	   //  			console.log("registry", registry, i, registry[i], manualdeep);

		  //   		for (var i in registry) {

		  //   			if (registry[i].check) {
		    				
		  //   				if (!registry[i].check(registry[i].current)) {
		  //   					console.log("current", registry[i].default);
			 //    				registry[i].current = registry[i].default
			 //    			}

		  //   			}
		  //   			else if (registry[i].children) {

		  //   				// if (!manualdeep[i]) manualdeep[i] = {};

		  //   				return recursiveRegistry(flag, {registy:registry[i].children})
		    				
		  //   			}
		  //   			else {
		  //   				console.log("recursive registry terminated abruptly with no value or children present");
		  //   			}

		  //   		}

	   //  		}

	   //  		console.log("mandeep registry return", manualdeep, registry);

	   //  		return manualdeep || registry;


    // 		}

    		react.subscribe({
	        	name:"programInput" + $scope.name,
	        	callback:function (x) {

	        		// programInput = x;

	        		console.log("receive program input evolve");

	        		$scope.resetInput({
	        			setInput:{
	        				programInput:x
	        			}
	        		})
	        	}
	        })


    		/*#########  default initial settings ############*/
    		var $$InitialSettings$$ = {
	    		gens:500,
	    		runs:20,
	    		goal:"max",
	    		pop:100,
	    		crossover:{
	    			parents:2,
	    			pool:0.1,
	    			splicemin:2,
	    			splicemax:12,
	    			mutate:0.02
	    		},
	    		programInput:{}
	    	}
	    	/*################################################*/


	    	$scope.evdata;
	    	$scope.stepdata;

	    	var initData = function () {


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

			}

			initData();

			$("#breakfeedback").hide();

			var setEvdata = function (x) {
	           	
	           	// console.log("set evdata", x);

	           	$scope.evdata = x;

	           	react.push({
	           		name:"ev." + $scope.name,
	           		state:$scope.evdata
	           	});
	        }


	        

			// $scope.setData = function ($d) {

			// 	console.log("set data", $scope.name, "\n", $d, "\n\n");

			// 	d = $d
			// 	// totalActions = d.data.actions ? d.data.actions.total : 1;
			// 	// $scope.goals = d.data.goals;
			// }

		 //    $scope.getData = function (complete) {

		 //    	// console.log("get data");

		 //        $http({
		 //        	method:"GET",
		 //        	url:"/evolve/data/" + $scope.name
		 //        })
		 //        .then(function (res) {

		 //            var $d = res.data.data;


		 //            // console.log("\nget data response", $scope.name, "\n", $d, "\n\n");

		 //            complete($d);

		 //        }, function (err) {

		 //            // console.log("Server error while getting data", err);

		 //        })

		 //    }

		    // $scope.getData(function ($d) {

		    // 	$scope.setData($d);
		    // });

		    $scope.evolving = function (_evolve) {
		        ev = _evolve;
		        if (_evolve) $scope.running(_evolve);
		    }
		    
		    $scope.running = function (_run) {
		        update = _run;
		        if (!_run) $scope.evolving(_run);
		    }

		    $scope.resetInput = function (options) {

		    	// console.log("input", d.data);

		    	var $input = options.$input;
		    	var setInput = options.setInput;

		    	if ($input) {

		    		manual = {
			    		gens:$input.gens || manual.gens,
			    		runs:$input.runs || manual.runs,
			    		goal:$input.goal || manual.goal,
			    		pop:$input.pop || manual.pop,
			    		crossover:{
			    			parents:$input.crossover.parents || manual.crossover.parents,
			    			pool:$input.crossover.pool || manual.crossover.pool,
			    			splicemin:$input.crossover.splicemin || manual.crossover.splicemin,
			    			splicemax:$input.crossover.splicemax || manual.crossover.splicemax,
			    			mutate:$input.crossover.mutate || manual.crossover.mutate
			    		},
			    		programInput:$input.programInput || manual.programInput
			    	}
		    	}
		    	else if (setInput) {

		    		manual = {
			    		gens:options.setInput.gens || $$InitialSettings$$.gens,
			    		runs:options.setInput.runs || $$InitialSettings$$.runs,
			    		goal:options.setInput.goal || $$InitialSettings$$.goal,
			    		pop:options.setInput.pop || $$InitialSettings$$.pop,
			    		crossover:{
			    			parents:options.setInput.crossover 
			    				? (options.setInput.crossover.parents || $$InitialSettings$$.crossover.parents) 
			    				: $$InitialSettings$$.crossover.parents,
			    			pool:options.setInput.crossover 
			    				? (options.setInput.crossover.pool || $$InitialSettings$$.crossover.pool) 
			    				: $$InitialSettings$$.crossover.pool,
			    			splicemin:options.setInput.crossover 
			    				? (options.setInput.crossover.splicemin || $$InitialSettings$$.crossover.splicemin) 
			    				: $$InitialSettings$$.crossover.splicemin,
			    			splicemax:options.setInput.crossover 
			    				? (options.setInput.crossover.splicemax || $$InitialSettings$$.crossover.splicemax) 
			    				: $$InitialSettings$$.crossover.splicemax,
			    			mutate:options.setInput.crossover 
			    				? (options.setInput.crossover.mutate || $$InitialSettings$$.crossover.mutate) 
			    				: $$InitialSettings$$.crossover.mutate
			    		},
			    		programInput:options.setInput.programInput || $$InitialSettings$$.programInput
			    	}

		    	}
		    	else {

			    	manual = {
			    		gens:$$InitialSettings$$.gens,
			    		runs:$$InitialSettings$$.runs,
			    		goal:$$InitialSettings$$.goal,
			    		pop:$$InitialSettings$$.pop,
			    		crossover:{
			    			parents:$$InitialSettings$$.crossover.parents,
			    			pool:$$InitialSettings$$.crossover.pool,
			    			splicemin:$$InitialSettings$$.crossover.splicemin,
			    			splicemax:$$InitialSettings$$.crossover.splicemax,
			    			mutate:$$InitialSettings$$.crossover.mutate
			    		},
			    		programInput:$$InitialSettings$$.programInput
			    	}
		    	}

		    	// console.log("reset input", $input, "initial", $$InitialSettings$$, "manual", manual);

		        $("#gensinput").val(manual.gens);
		        $("#runsinput").val(manual.runs);
		        $("#goalinput").val(manual.goal);
		        $("#popinput").val(manual.pop);

		        $("#parentsinput").val(manual.crossover.parents);
		        $("#poolinput").val(manual.crossover.pool);
		        $("#splicemininput").val(manual.crossover.splicemin);
		        $("#splicemaxinput").val(manual.crossover.splicemax);
		        $("#mutateinput").val(manual.crossover.mutate);

		        $scope.settings = {
		        	gens:manual.gens,
		        	runs:manual.runs,
		        	goal:manual.goal,
		        	pop:manual.pop,
		        	crossover:{
		        		parents:manual.crossover.parents,
		        		pool:manual.crossover.pool,
		        		splicemin:manual.crossover.splicemin,
		        		splicemax:manual.crossover.splicemax,
		        		mutate:manual.crossover.mutate
		        	}
		        }

		        // react.push({
		        // 	name:"resetInput",
		        // 	state:manual
		        // })

		    }


		    // var validateSettingsInputs = function (inputs) {


		    // 	return recursiveRegistry("validate", {registry:inputs});
		    // }


		    // var checkSettingsForUpdates = function () {


		    // 	var settingsInputs = {
		    // 		gens:{
		    // 			current:$("#gensinput").val()
		    // 		},
		    // 		runs:{
		    // 			current:$("#runsinput").val()
		    // 		},
		    // 		goal:{
		    // 			current:$("#goalinput").val()
		    // 		},
		    // 		pop:{
		    // 			current:$("#popinput").val()
		    // 		},
		    // 		crossover:{
		    // 			children:{
			   //  			parents:{
			   //  				current:$("#parentsinput").val()
			   //  			},
			   //  			pool:{
			   //  				current:$("#poolinput").val()
			   //  			},
			   //  			splicemin:{
			   //  				current:$("#splicemininput").val()
			   //  			},
			   //  			splicemax:{
			   //  				current:$("#splicemaxinput").val()
			   //  			},
			   //  			mutate:{
			   //  				current:$("#mutateinput").val()
			   //  			}
			   //  		}
		    // 		}
		    // 	}

		    // 	settingsInputs = recursiveRegistry("getChecks", {manual:settingsInputs, registry:inputRegistry})

		    // 	console.log("settings input", settingsInputs);

		    // 	settingsInputs = validateSettingsInputs(settingsInputs);

		    // 	console.log("validate settings", settingsInputs);

		    // 	return recursiveRegistry("setManual", {manual:manual, registry:settingsInputs});

		    // }


		    // $scope.resetInput = function (options) {

		    // 	console.log("reset input", options);

		    // 	if (options && options.$input) {

		    // 		manual = recursiveRegistry("setManual", {manual:{}, registry:options.$input});

		    // 	}
		    // 	else if (options && options.setInput) {

		    // 		manual = recursiveRegistry("setManual", {manual:{}, registry:options.setInput});
		    // 	}
		    // 	else {

		    // 		manual = recursiveRegistry("setManual", {manual:{}, registry:inputRegistry});

		    // 	}

		    // 	console.log("reset input", options, manual);

		    // }

		    $scope.getInput = function ($x) {

		    	if ($x) manual = $x;

		    	// console.log("get input manual", manual);

		    	// manual = checkSettingsForUpdates();

		        $scope.input = {
		            name:$scope.name,
		            gens:parseInt((manual ? manual.gens : undefined) || $("#gensinput").val()),
		            runs:parseInt((manual ? manual.runs : undefined) || $("#runsinput").val()),
		            goal:(manual ? manual.goal : undefined) || $("#goalinput").val(),
		            pop:parseInt((manual ? manual.pop : undefined) || $("#popinput").val()),
		            crossover:{
		            	parents:parseInt((manual 
		            	             ? (manual.crossover 
		            	                ? manual.crossover.parents : undefined) 
		            	             : undefined) || $("#parentsinput").val()),
		        		pool:parseFloat((manual 
		            	             ? (manual.crossover 
		            	                ? manual.crossover.pool : undefined) 
		            	             : undefined) || $("#poolinput").val()),
		        		splicemin:parseInt((manual 
		            	             ? (manual.crossover 
		            	                ? manual.crossover.splicemin : undefined) 
		            	             : undefined) || $("#splicemininput").val()),
		        		splicemax:parseInt((manual 
		            	             ? (manual.crossover 
		            	                ? manual.crossover.splicemax : undefined) 
		            	             : undefined) || $("#splicemaxinput").val()),
		        		mutate:parseFloat((manual 
		            	             ? (manual.crossover 
		            	                ? manual.crossover.mutate : undefined) 
		            	             : undefined) || $("#mutateinput").val())
		            },
		            programInput:manual.programInput,
		            evdelay:0,
		            newenv:true,
		            session:$scope.session
		        }

		        // console.log("manual get input", manual);

		        // $scope.input = {
		        // 	name:$scope.name,
		        // 	gens:manual.gens.current,
		        // 	runs:manual.runs.current,
		        // 	goal:manual.goal.current,
		        // 	pop:manual.pop.current,
		        // 	crossover:{
		        // 		parents:manual.crossover.parents.current,
		        // 		pool:manual.crossover.pool.current,
		        // 		splicemin:manual.crossover.splicemin.current,
		        // 		splicemax:manual.crossover.splicemax.current,
		        // 		mutate:manual.crossover.mutate.current
		        // 	},
		        // 	programInput:manual.programInput,
		        // 	evdelay:0,
		        // 	newenv:true,
		        // 	session:$scope.session
		        // }

		        // console.log("input", $scope.input);

		        return $scope.input;
		    }

		    $scope.resendInput = function () {

		    	// $scope.input.gen = $scope.stepdata.gen;

		    	return $scope.input;
		    }

			var stepprogress = function () {

				var input = $scope.getInput();

				// totalSteps = input.programInput.gridSize*input.programInput.gridSize*2;

		        var genT = $scope.input.gens;
		        var orgT = $scope.input.pop;
		        var runT = $scope.input.runs;
		        var stepT = $scope.getInput().programInput.totalSteps;

		        var gen = $scope.stepdata.gen - 1;
		        var org = $scope.stepdata.org - 1;
		        var step = $scope.stepdata.step || 0;
		        var run = $scope.stepdata.run - 1;

		        // console.log("percent", gen, org, step, run);

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

	                if ($scope.stepdata.gen != $scope.evdata.index) {
	                	getBest();
	                }

	                setTimeout(function () {

	                	if (update) setStepdata();
	                }, 0);

	            }, function (err) {

	                console.log("Server error while getting stepdata", err);

	            })

		   	}

		   	var initializeAlgorithmBackend = function (complete) {


		        $http({
		            method:"POST",
		            url:"/evolve/initialize",
		            data:{input:$scope.getInput()}
		        })
		        .then(function (res) {

		            console.log("Initialize algorithm", res.data.success);



		            if (complete) complete();

		        }, function (err) {

		            console.log("Server error while initializing algorithm", err.message);

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

	                if (complete) complete();

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

	                if (!res.data.success) {

	                	initializeAlgorithmBackend(function () {

	                		runEvolveBackend(function  () {

	                			if (complete) complete();

	                		})

	                	});


	                }
	                else {

	                	 if (complete) complete();
	                }

	               

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

	                if (complete) complete();

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

	                if (complete) complete();

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


		    react.subscribe({
		    	name:"resetInput",
		    	callback:function(x) {

    				// $scope.resetInput({$input:x});

		    		$scope.getInput(x);
		    	}
		    })


		    events.on("evolve.complete", function () {
		        completeEvolve();
		    });

		    $scope.resetgen = function () {

		        console.log("reset gen");
		        $scope.running(false);
		        
		        $scope.resetInput();
		        
		        $scope.animateRefresh(function () {

		            // setEvolveBackend();

		            initializeAlgorithmBackend(function () {

		            	initData();
		            	
		            });

		        });
		    }


		    $scope.run = function () {

		        // simulator.refresh();
		        $scope.evolving(true);

		        display.forceEvolveHeight();


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


            			runEvolveBackend(function () {

            				runEvolveComplete();
            			});
		                
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