app.directive("trashsimdata", ["global.service", "events.service", "utility", function (g, events, u) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/trash/trashsimdata.html",	
		link:function ($scope, element, attr) {


			// console.log("############\ncreate trash sim directive\n\n");

			var winW;
			// var winH;

			var height;
			// var width;

			var $elem;
			var $stage;
			var hudToggle;
			// var items;


			// var simDataResize = function () {

			// 	winH = $(window).height();
			// 	// winW = $(window).width();

			// 	factor = g.isMobile() ? 0.5 : 0.8;
			// 	// width = 0.25;

			// 	height = winH*factor;	

			// 	$elem = $("#simdatatoggle");
			// 	$stage = $("#stagetoggle");
			// 	// $controls = $("#controlstoggle");
			// 	$hudtoggle = $("#hudtoggle");

			// 	$elem.css({height:height + "px"});

			// 	$elem.css({top:($stage.offset().top - $hudtoggle.offset().top) + Math.abs(height-$stage.height())/2 + "px"});

			// }

			// // console.log("\nregister event trash-sim-data display\n\n");
			// events.on("load-display", "trash-sim", function () {


			// 	// console.log("\ntrash sim data load display\n\n");

			// 	simDataResize();

			// 	$(window).resize(function () {

			// 		simDataResize();
			// 	});


			// 	return "success";

			// });
			
			
		}

	}

}]);