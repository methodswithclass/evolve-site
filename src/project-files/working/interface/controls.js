app.directive("controls", ["events.service", 'global.service', "utility", function (events, g, u) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		templateUrl:"assets/views/common/interface/controls.html",		
		link:function ($scope, $element, attr) {


			// console.log("\n############\ncreate controls directive\n\n");

			var toggle = true;


			var winW;
			var winH;
			var controlsW;
			var toolW;
			var width;
			var factor;
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


			var controlsWidth = function (name) {

				winW = $(window).width();
				winH = $(window).height();

				width = 0.6;
				factor = 0.6/controls.length;
				cntrlWidth = 0;
				toolW = 0.75;

				$elem = $("#controlstoggle");
				// $trashsim = $("#trashsimtoggle");
				$stage = $("#stagetoggle");
				// $controls = $("#controlstoggle");
				$hudtoggle = $("#hudtoggle");


				$elem.css({width:winW*width});
				// $trashsim.css({top:$elem.offset().top + $elem.height() + 200 + "ps"});

				runToggle.input.css({width:winW*width});
				

				cntrlWidth = $elem.width()/controls.length;

				// console.log("controls load", cntrlWidth, $elem.width());
				

				if (name == "trash" || name == "recognize") {

					$elem.css({top:($stage.offset().top - $hudtoggle.offset().top) + $stage.height() + "px", zIndex:100});
				}
				else if (name == "feedback") {

					// $elem.css({top:($stage.offset().top - $hudtoggle.offset().top) + $stage.height() + 100 + "px"});
				
					$elem.css({top:"50px", zIndex:100});
				}
				
				controls.forEach(function (value, index) {

					halfPercent = cntrlWidth/2/$elem.width()*100;

					zeroPercent = 50 - halfPercent;

					// console.log("zero percent", zeroPercent, halfPercent);

					if (index == 2) {

						value.input.css({width:cntrlWidth, left:zeroPercent  + "%"});
					}
					else if (index < 2 ) {

						value.input.css({width:cntrlWidth, left:zeroPercent - (2-index)*cntrlWidth*factor  + "%"})
					}
					else if (index > 2) {
						value.input.css({width:cntrlWidth, left:zeroPercent + (index-2)*cntrlWidth*factor  + "%"})
					}

				})

			}


			// console.log("\nregister event controls display\n\n");
			events.on("load-display", "controls-trash", function () {


				// console.log("\ncontrols load display\n\n");

				controlsWidth("trash");

				$(window).resize(function () {

					console.log("resize");

					controlsWidth("trash");
				})

				return "success";

			})


			// console.log("\nregister event controls display\n\n");
			events.on("load-display", "controls-feedback", function () {


				// console.log("\ncontrols load display\n\n");

				controlsWidth("feedback");

				$(window).resize(function () {

					console.log("resize");

					controlsWidth("feedback");
				})

				return "success";

			})


			// console.log("\nregister event controls display\n\n");
			events.on("load-display", "controls-recognize", function () {


				// console.log("\ncontrols load display\n\n");

				controlsWidth("recognize");

				$(window).resize(function () {

					console.log("resize");

					controlsWidth("recognize");
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