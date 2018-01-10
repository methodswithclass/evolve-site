app.directive("evolvedata", ['events.service', 'global.service', "utility", function (events, g, u) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/common/interface/evolvedata.html",	
		link:function ($scope, element, attr) {
			

			// console.log("\n############\ncreate evolve data directive\n\n");

			var winW;
			var winH;

			var width = 0.8;
			
			var evolveDataWidth = function (name) {

				winW = $(window).width();
				winH = $(window).height();

				$evolve = $("#evolvedatatoggle");
				$hud = $("#hudtoggle");
				$stage = $("#stagetoggle");
				$arena = $("#arena");


				if (name == "trash" || name == "recognize") {
					$evolve.css({top:"400px"});
				}
				else if (name == "feedback") {
					$evolve.css({top:($stage.offset().top - $hud.offset().top) + $arena.height() + 200 + "px"});	
				}
				
			}

			// console.log("\nregister event evolve-data display\n\n");
			events.on("load-display", "evolve-data-trash", function () {


				// console.log("\nevolve data load display\n\n");

				evolveDataWidth("trash");

				$(window).resize(function () {

					evolveDataWidth("trash");
				})

				return "success";

			});


			// console.log("\nregister event evolve-data display\n\n");
			events.on("load-display", "evolve-data-feedback", function () {


				// console.log("\nevolve data load display\n\n");

				evolveDataWidth("feedback");

				$(window).resize(function () {

					evolveDataWidth("feedback");
				})

				return "success";

			});


			// console.log("\nregister event evolve-data display\n\n");
			events.on("load-display", "evolve-data-recognize", function () {


				// console.log("\nevolve data load display\n\n");

				evolveDataWidth("recognize");

				$(window).resize(function () {

					evolveDataWidth("recognize");
				})

				return "success";

			});

		}

	}

}]);