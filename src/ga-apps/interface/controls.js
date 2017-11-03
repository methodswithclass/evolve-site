app.directive("controls", function () {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		templateUrl:"assets/views/ga-apps/interface/controls.html",		
		link:function ($scope, element, attr) {


			var toggle = true;

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

			for (i in controls) {

				setHover(i);
			}

		}

	}

});