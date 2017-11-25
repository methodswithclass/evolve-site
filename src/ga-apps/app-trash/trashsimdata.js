app.directive("trashsimdata", ["global.service", "events.service", function (g, events) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/trash/trashsimdata.html",	
		link:function ($scope, element, attr) {


			// console.log("############\ncreate trash sim directive\n\n");

			var winW;
			var winH;

			var height;
			var width;

			var $elem;
			var items;


			var simDataResize = function () {

				winH = $(window).height();
				winW = $(window).width();

				height = 0.5;
				width = 0.25;

				$elem = $("#simdata");
				$stage = $("#stage");
				$hudtoggle = $("#hudtoggle");
				items = $("#simdatainner").children();

				// console.log("sim data inner width", winW*width);

				if (g.isMobile()) {

					$elem.css({top:($stage.offset().top - $hudtoggle.offset().top) + $stage.height() + 200 + "px", width:0.9*winW});
				}
				else {
					
					$elem.css({width:winW*width, height:winH*height})

					items.each(function (index) {

						$(this).css({height:winH*height/items.length});
					});
				}
			}

			// console.log("\nregister event trash-sim-data display\n\n");
			events.on("load-display", "trash-sim", function () {


				// console.log("\ntrash sim data load display\n\n");

				simDataResize();

				$(window).resize(function () {

					simDataResize();
				});


				return "success";

			});
			
			
		}

	}

}]);