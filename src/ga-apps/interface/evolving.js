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



		    $scope.resetgen = function () {

		        
		    	$scope.animateRefresh();


		        evolve.resetgen(function () {

		        	console.log("Initialize algorithm success", res);
		        	initData();
		        });


		    }



		    $scope.run = function () {

		    	$scope.input = $input.getInput();

		        evolve.run($scope);
		    }


		    $scope.breakRun = function () {

		        evolve.breakRun($scope);

		    }



		}
	}

}]);