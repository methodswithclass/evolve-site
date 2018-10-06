app.directive("trashArena", ["utility", "states", "toast.service", "controls.service", function (u, states, $toast, controls) {
	


	return {
		restrict:"E",
		replace:true,
		scope:false,
		template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attrs) {



			var shared = window.shared;
			var g = shared.utility_service;
			var react = shared.react_service;

			var name = states.getName();
			var first = true;

			$scope.getContentUrl = function () {

				return "assets/views/evolve-app/demos/app-trash/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/trash_arena.html";
			}


			var cleanBlock = function (x, y) {

		        console.log("no clean block");
		    }

		    var makeBlocks = function (env) {

		        console.log("no make blocks");
		    }


		    var toggleEnable = function (_toggle, currentGen) {

		   		u.toggle((!_toggle ? "show" : "hide"), "arena-cover", {delay:300, fade:300});
		    
		   		if (!_toggle) {


		   			$toast.showToast({message:"Server Error: no trash received", duration:0, delay:0});

		   			setTimeout(function () {

		   				controls.disable();	
		   			}, 600)

		   		}
		   		else if (_toggle) {

		   			$toast.hide();
		   			controls.enable(name, currentGen);
		   			
		   		}

		    }

			react.subscribe({
		        name:"block.functions",
		        callback:function (x) {

		            // console.log("assign clean block function");

		            cleanBlock = x.cleanBlock;
		            makeBlocks = x.makeBlocks;
		        }
		    })


		    react.subscribe({
		    	name:"checkenvironment" + name,
		    	callback:function (x) {

					// console.log("check environment", x.stepdata.gen);


					toggleEnable(!x.env ? false : true, x.stepdata.gen);
					
		    	}	

		    })


		    $scope.refreshArena = function () {

		    	$scope.refresh();
		    }

		}
	}
}])