app.directive("evolvedata", ['events.service', 'global.service', function (events, g) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/evolvedata.html",	
		link:function ($scope, element, attr) {
			

			// console.log("\n############\ncreate evolve data directive\n\n");

			var winW;
			var winH;

			var width = g.isMobile() ? 0.8 : 0.5;
			

			// var effW = winW - 20 - 100 - 300 - 30;
			// var effH = winH - 20 - 20 - 30;
			// var effHsim = winH - 20 - 20 - 30 - 200;

			// var max = Math.min(effW, effH - 100);


			var evolveDataWidth = function () {

				winW = $(window).width();
				winH = $(window).height();

				$("#evolvedata").css({width:winW*width});

				if (g.isMobile()) {

					$("#evolvedata").css({top:"400px"});
					$("#stage").css({top:($("#evolvedata").offset().top - $("#hudtoggle").offset().top) + $("#evolvedata").height() + 150 + "px"})
					events.dispatch("load-display", "trash-sim");
					events.dispatch("load-display", "controls");
				}
			}



			// console.log("\nregister event evolve-data display\n\n");
			events.on("load-display", "evolve-data", function () {


				// console.log("\nevolve data load display\n\n");

				evolveDataWidth();

				$(window).resize(function () {

					evolveDataWidth();
				})

				return "success";

			});

		}

	}

}]);