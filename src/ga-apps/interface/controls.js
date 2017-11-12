app.directive("controls", ["events.service", function (events) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		templateUrl:"assets/views/ga-apps/interface/controls.html",		
		link:function ($scope, element, attr) {


			var toggle = true;


			var winW;
			var controlsW;
			var toolW

			var controls = [
			{
				name:"refresh",
				input:$("#refreshtoggle"),
				tool:$("#refreshtool")
			},
			{
				name:"restart",
				input:$("#restarttoggle"),
				tool:$("#restarttool")
			},
			{
				name:"step",
				input:$("#steptoggle"),
				tool:$("#steptool")
			},
			{
				name:"play",
				input:$("#playtoggle"),
				tool:$("#playtool")
			},
			{
				name:"stop",
				input:$("#stoptoggle"),
				tool:$("#stoptool")
			}
			]

			var runToggle = {
				name:"run",
				input:$("#runtoggle")
			}

			var setHover = function (i) {

				controls[i].input.hover(function () {

					//console.log("on", controls[i].name);
					controls[i].tool.animate({opacity:1}, 100);
				},
				function () {

					//console.log("off", controls[i].name);
					controls[i].tool.animate({opacity:0}, 100);
				});
			}


			var controlsWidth = function () {

				winW = $(window).width();

				width = 0.3;
				toolW = 0.75;

				$("#controls").css({width:winW*width});

				controls.forEach(function (value, index) {

					value.input.css({width:winW*width/controls.length*toolW})
				})

				// runToggle.input.css({width:winW*width});

			}


			console.log("\nregister event controls display\n\n");
			events.on("load-controls-display", function () {


				console.log("\ncontrols load display\n\n");

				controlsWidth();

				// runToggle.input.addClass("width");

				$(window).resize(function () {

					controlsWidth();
				})

			})


			// for (i in controls) {

			// 	setHover(i);
			// }

			controls.forEach(function (value, index) {

				setHover(index);
			})

		}

	}

}]);