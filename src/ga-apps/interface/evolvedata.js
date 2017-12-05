app.directive("evolvedata", ['events.service', 'global.service', "utility", function (events, g, u) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/evolvedata.html",	
		link:function ($scope, element, attr) {
			

			// console.log("\n############\ncreate evolve data directive\n\n");

			var winW;
			var winH;

			var width = 0.8;
			
			var evolveDataWidth = function () {

				winW = $(window).width();
				winH = $(window).height();

				$evolve = $("#evolvedatatoggle");
				$hud = $("#hudtoggle");
				$stage = $("#stagetoggle");


				
				$evolve.css({top:"400px"});
				$stage.css({top:($evolve.offset().top - $hud.offset().top) + $evolve.height() + 150 + "px"})


				// console.log("evolve data dispatch events, trash sim and controls");

				events.dispatch("load-display", "trash-sim");
				events.dispatch("load-display", "controls");

				
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