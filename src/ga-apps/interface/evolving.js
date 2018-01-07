app.directive("evolving", ['global.service', 'utility', 'events.service', 'react.service', 'input.service', 'evolve.service', function (g, u, events, react, $input, evolve) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/common/ga-apps/interface/evolving.html",		
		link:function ($scope, element, attr) {

			var self = this;


			console.log("\n############\ncreate evolveing directive\n\n");

			
			

    		

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
	        

		    
			react.subscribe({
		        name:"ev." + $scope.name,
		        callback:function (x) {
		            // console.log("set evdata trash", x);
		            $scope.evdata = x;
		        }

		    });

		    react.subscribe({
		        name:"step." + $scope.name,
		        callback:function (x) {
		            // console.log("set evdata trash", x);
		            $scope.stepdata = x;
		        }

		    });




		    var stepprogress = function () {
		

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




		    $scope.resetgen = function () {

		        evolve.resetgen($scope, function () {


		        	console.log("Initialize algorithm success", res);

			    	initData();

			    	// programInputToggle();

		        });
		    }



		    $scope.run = function () {

		    	$scope.input = $input.getInput();

		        evolve.run($scope);
		    }


		    $scope.breakRun = function () {

		        evolve.breakRun($scope);

		    }



		    /*
			----------------------------------------------
			###############################################
		    */









		}
	}

}]);