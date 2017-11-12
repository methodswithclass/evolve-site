app.directive("evolvedata", ['events.service', 'global.service', function (events, g) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, element, attr) {
			
			var winW;
			var winH;

			var width = 0.5;


			$scope.getContentUrl = function() {
    
		        var view;

		        if (g.isMobile()) {

		            view = "assets/views/mobile/ga-apps/interface/evolvedata.html";
		        }
			    else {
			        view = "assets/views/desktop/ga-apps/interface/evolvedata.html";
			    }

		        return view;
		    }
			

			// var effW = winW - 20 - 100 - 300 - 30;
			// var effH = winH - 20 - 20 - 30;
			// var effHsim = winH - 20 - 20 - 30 - 200;

			// var max = Math.min(effW, effH - 100);


			var evolveDataWidth = function () {

				winW = $(window).width();
				winH = $(window).height();

				$("#evolvedata").css({width:winW*width});
			}



			console.log("\nregister event evolve-data display\n\n");
			events.on("load-evolve-data-display", function () {


				console.log("\nevolve data load display\n\n");

				evolveDataWidth();

				$(window).resize(function () {

					evolveDataWidth();
				})

			});

		}

	}

}]);