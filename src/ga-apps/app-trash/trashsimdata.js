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
				$controls = $("#controls");
				$hudtoggle = $("#hudtoggle");
				// items = $("#simdatainner").children();

				$elem.css({top:($stage.offset().top - $hudtoggle.offset().top) + $stage.height() + 400 + "px"});

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