app.directive("trashsimdata", ["events.service", function (events) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, element, attr) {



			$scope.getContentUrl = function() {
    
		        var view;

		        if (g.isMobile()) {

		            view = "assets/views/mobile/ga-apps/trash/trashsimdata.html";
		        }
			    else {
			        view = "assets/views/desktop/ga-apps/trash/trashsimdata.html";
			    }

		        return view;
		    }


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
				items = $("#simdatainner").children();

				console.log("sim data inner width", winW*width);

				$elem.css({width:winW*width, height:winH*height})

				items.each(function (index) {

					$(this).css({height:winH*height/items.length});
				});
			}

			console.log("\nregister event trash-sim-data display\n\n");
			events.on("load-trash-sim-display", function () {


				console.log("\ntrash sim data load display\n\n");

				simDataResize();

				$(window).resize(function () {

					simDataResize();
				});


			});
			
			
		}

	}

}]);