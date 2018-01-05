app.directive("evolving", ['global.service', 'utility', 'events.service', 'react.service', 'simulators', "$http", 'display.service', 'api.service', 'input.service', function (g, u, events, react, simulators, $http, display, api, $input) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/common/ga-apps/interface/evolving.html",		
		link:function ($scope, element, attr) {

			var self = this;


			console.log("\n############\ncreate evolveing directive\n\n");

			
			var simulator = simulators.get($scope.name);
    		var update = false;
		    var ev = false;

    		

		    $scope.input;
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
			    };

			}

			initData();

			$("#breakfeedback").hide();
	        

		    $scope.evolving = function (_evolve) {
		        ev = _evolve;
		        if (_evolve) $scope.running(_evolve);
		    }
		    
		    $scope.running = function (_run) {
		        update = _run;
		        if (!_run) $scope.evolving(_run);
		    }


		    var programInputToggle = function ($toggle) {


		    	var toggle = $toggle == false ? -1 : ($toggle == true ? 1 : (($toggle == null || $toggle == undefined) ? 0 : 1));
		    	

		    	// internal overrides
		    	// toggle = 0;
		    	// toggle = -1;
		    	toggle = 1; 


		    	$scope.feedback = "these can only be set before evolving";

		    	var properties = {
		    		on:{
		    			input:{
		    				color:"black"
		    			},
		    			grid:{
		    				color:"black"
		    			},
		    			trash:{
		    				color:"black"
		    			},
		    			back:{
		    				display:"none"
		    			},
		    			cover:{
		    				display:"none"
		    			},
		    			feedback:{
		    				display:"none"
		    			}
		    		},
		    		off:{
		    			input:{
		    				color:"gray"
		    			},
		    			grid:{
		    				color:"gray"
		    			},
		    			trash:{
		    				color:"gray"
		    			},
		    			back:{
		    				display:"block",
		    				backgroundColor:"black"
		    			},
		    			cover:{
		    				display:"block",
		    				backgroundColor:"white",
		    				opacity:0.3
		    			},
		    			feedback:{
		    				display:"block",
		    				color:"white",
		    				fontSize:"15px"
		    			}
		    		}
		    	}


		    	var getProps = function (state, id) {

		    		return properties[state][id];
		    	}

		    	var ih;
		    	var iw;
		    	var ed;
		    	var top;

		    	var $parent = $("#programConfig");
		    	var $input = $("#programInput_input");
		    	var $cover = $("#programInput_cover");
		    	var $back = $("#programInput_back");
		    	var $feedback = $("#programInput_feedback");

		    	var $grid = $("#gridSizeInput");
		    	var $trash = $("#trashRateInput");

		    	$parent.css({height:(g.isMobile() ? "60%" : "80%")})

		    	setTimeout(function () {

		    		ih = $input.height();
			    	iw = $input.width();

			    	// console.log("\n\n\n\n\n\n\nprogram-input elements\n\n\n\n", "parent", $parent[0], "parent height", $parent.height(), "parent width", $parent.width(), "\n\ninput", $input[0], "input height", $input.height(), "input width", $input.width(), "\n\n\n\n\n\n\n\n\n");

			    	ed = u.correctForAspect({
			    		id:"program-input",
			    		factor:1.2,
			    		aspect:0.8,
			    		height:ih,
			    		width:iw,
			    		window:false
			    	})

			    	top = (ih - ed.height)/2;
			    	
			    	$back.css({height:ed.height, width:ed.width, top:top + "px"});
			    	$cover.css({height:ed.height, width:ed.width, top:top + "px"});
			        // $feedback.css(getProps("off", "feedback"));

			        // console.log("\n\n\n\n\n\n\nprogram input toggle \n\n\n\n", toggle, "\n\n\n\n\n\n\n\n\n");

			    	if (toggle != -1 && (toggle == 1 || (toggle == 0 && $scope.stepdata.gen == 0))) {

			     		$input.css(getProps("on", "input"));
			        	$grid.css(getProps("on", "grid"));
			        	$trash.css(getProps("on", "trash"));

			        	$back.css(getProps("on", "back"));
			        	$cover.css(getProps("on", "cover"));
			        	// $feedback.css(getProps("on", "feedback"));

			        }
			        else {

			        	$input.css(getProps("off", "input"));
			        	$grid.css(getProps("off", "grid"));
			        	$trash.css(getProps("off", "trash"));

			        	$back.css(getProps("off", "back"));
			        	$cover.css(getProps("off", "cover"));
			        	// $feedback.css(getProps("off", "feedback"));

			        }

		    	}, 1000);


		    	$scope.programInputToggle = toggle;

		    }


		    var initProgramToggle = function () {

		    	setTimeout(function () {

				    programInputToggle($scope.programInputToggle);


				    $(window).resize(function () {

				    	programInputToggle();
				    })

				}, 1000);

			}


			initProgramToggle();
		    


		    /*
			##########################################
			# Set Evolvution Data
			#
			#
			#
			##########################################
		    */


		    var setEvdata = function (x) {
	           	
	           	// console.log("set evdata", x);

	           	$scope.evdata = x;

	           	react.push({
	           		name:"ev." + $scope.name,
	           		state:$scope.evdata
	           	});
	        }

	        var getBest = function (complete) {


		    	api.getBest($scope, function (res) {

			    	setEvdata(res.data.ext);

			    	if (complete) complete();

			    })

		    }

		    var genA = 0;
		    var genB = genA;

		    var setStepdata = function () {


		    	api.stepdata($scope, function (res) {

			    	// console.log("get stepdata", res.data.stepdata);

		    		var stepdata = res.data.stepdata ? res.data.stepdata : $scope.stepdata;

		    		genA = stepdata.gen;

		    		// console.log("stepdata", res.data.stepdata, stepdata);

		            $scope.stepdata = {
		            	gen:stepdata.gen,
		            	org:stepdata.org,
		            	run:stepdata.run,
		            	step:stepdata.step
		            }

		            if (genA != genB) {
		            	genB = genA;
		            	getBest();
		            }

		            setTimeout(function () {

		            	if (update) setStepdata();
	           		}, 0);

			    })

		    }


		    

			var stepprogress = function () {

				$scope.input = $input.getInput();

				

		        var genT = $scope.input.gens;
		        var orgT = $scope.input.pop;
		        var runT = $scope.input.runs;
		        var stepT = $scope.input.programInput.totalSteps;

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




		    /*
			----------------------------------------------
			###############################################
		    */









		    /*
			##########################################
			# Update Timer
			#
			#
			#
			##########################################
		    */


		    setInterval(function () {

		        if (update) {
		            if (ev) {
		                stepprogress();
		            }
		            $scope.$apply();
		        }

		    }, 30);



		    /*
			----------------------------------------------
			###############################################
		    */









		    /*
			##########################################
			# Complete Evolution
			#
			#
			#
			##########################################
		    */


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


					        // programInputToggle();


					    }
					});

		    	});


		    }




		    /*
			----------------------------------------------
			###############################################
		    */











		    /*
			##########################################
			# Run Control Functions
			#
			#
			#
			##########################################
		    */




		    $scope.resetgen = function () {

		        console.log("reset gen");
		        
		        // $scope.resetInput();
		        
		        $scope.animateRefresh(function () {

		            api.initialize($scope, function (res) {

				    	console.log("Initialize algorithm success", res);

				    	initData();

				    	programInputToggle();
				    	
				    })

		        });


		    }





		    var isRunning = function () {

		    	api.isRunning($scope, function (res) {

			    	$scope.running(res.data.running);

					setTimeout(function () {
		        	
		            	if (update) {
		            		isRunning();
		            	}
		            	else {
				    		completeEvolve();
				    	}

		            }, 500)

			    })

		    }


 			var runEvolveComplete = function () {

				isRunning();

				setStepdata();

				simulator.reset($scope.session);
				simulator.refresh($scope.session);
		    }


		    $scope.run = function () {

		        $scope.evolving(true);

		        display.forceEvolveHeight();


		        // $("#programInputCover").removeClass("none").addClass("block");

		        u.toggle("hide", "settings", {fade:300});
		        u.toggle("hide", "run", {fade:300});
		        u.toggle("disable", "refresh", {fade:300});
		        u.toggle("disable", "restart", {fade:300});
		        u.toggle("disable", "step", {fade:300});
		        u.toggle("disable", "play", {fade:300});
		        u.toggle("disable", "stop", {fade:300});
		        
		        u.toggle("show", "evolve", {
		            fade:600,
		            delay:600,
		            complete:function () {


            			api.run($scope, function (res) {

					    	console.log("Run algorithm success", res);

					    	runEvolveComplete();
					    })
		                
		            }
		        });

		        setTimeout(function () {
		            $("#evolvepage").animate({color:"#fff"}, 600);
		            $("#evolvepage").addClass("white-t");
		        }, 300);
		    }


		    $scope.breakRun = function () {

		        $scope.running(false);
		        $("#breakfeedback").show();

		        $input.setInput({
		        	gens:$scope.stepdata.gen
		    	});

		        api.hardStop($scope, function (res) {

	            	console.log("Hard stop algorithm success", res);

	            	completeEvolve();
			    })


		    }



		    /*
			----------------------------------------------
			###############################################
		    */









		}
	}

}]);