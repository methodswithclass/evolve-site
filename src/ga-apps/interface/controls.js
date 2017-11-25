app.directive("controls", ["events.service", 'global.service', function (events, g) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/controls.html",		
		link:function ($scope, $element, attr) {


			// console.log("\n############\ncreate controls directive\n\n");

			var toggle = true;


			var winW;
			var controlsW;
			var toolW;
			var cntrlWidth;
			var zeroPercent;

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

				width = 0.6;
				cntrlWidth = 0;
				toolW = 0.75;

				$elem = $("#controls");
				$stage = $("#stage");
				$hudtoggle = $("#hudtoggle");


				$elem.css({width:winW*width});

				runToggle.input.css({width:winW*width});

				cntrlWidth = $elem.width()/controls.length;

				console.log("controls load", cntrlWidth, $elem.width());
				
				$elem.css({top:($stage.offset().top - $hudtoggle.offset().top) + $stage.height() + "px"});

				
				controls.forEach(function (value, index) {

					halfPercent = cntrlWidth/2/$elem.width()*100;

					zeroPercent = 50 - halfPercent;

					console.log("zero percent", zeroPercent, halfPercent);

					if (index == 2) {

						value.input.css({width:cntrlWidth, left:zeroPercent  + "%"});						
					}
					else if (index < 2 ) {

						value.input.css({width:cntrlWidth, left:zeroPercent - (2-index)*cntrlWidth*0.6/controls.length  + "%"})
					}
					else if (index > 2) {
						value.input.css({width:cntrlWidth, left:zeroPercent + (index-2)*cntrlWidth*0.6/controls.length  + "%"})
					}

				})

			}


			// console.log("\nregister event controls display\n\n");
			events.on("load-display", "controls", function () {


				// console.log("\ncontrols load display\n\n");

				controlsWidth();

				$(window).resize(function () {

					console.log("resize");

					controlsWidth();
				})

				return "success";

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