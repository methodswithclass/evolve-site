app.directive("settings", ['global.service', "events.service", function (g, events) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/settings.html",	
		link:function ($scope, element, attr) {


			// console.log("\n############\ncreate settings directive\n\n");

			let settingsWidth = 800;


			var toggle = true;
			var status = {opened:false, right:{opened:-20, closed:-settingsWidth}};
			$("#settingstoggle").css({right:status.right.closed});

			var winH = $(window).height();
			var winW = $(window).width();

			var width = 0.6;

			var controls = [
			{
				name:"open",
				input:$("#opensettings"),
				tool:$("#opentool")
			}
			]

			var inputs = [
			{
				input:$("#gensinput")
			},
			{
				input:$("#runsinput")
			},
			{
				input:$("#goalinput")
			},
			{
				input:$("#popinput")
			},
			{
				input:$("#refreshbtn")
			}
			]


			var evolveToggle = {
				name:"evolve",
				input:$("#evolvetoggle")
			}

			$stage = $("#stage");

			var setHover = function (i) {

				controls[i].input.hover(function () {
					controls[i].tool.animate({opacity:1}, 100);
				},
				function () {
					controls[i].tool.animate({opacity:0}, 100);
				});
			}

			for (i in controls) {
				setHover(i);
			}

			var isFocus = function () {

				for (i in inputs) {
					if (inputs[i].input.is(":focus")) {
						return true;
					}
				}

				return false;
			}

			var animateToggle = function (open_up) {

				controls[0].tool.animate({opacity:0}, 200);
				$("#settingstoggle").animate({right:(!open_up || status.opened ? status.right.closed : (open_up || status.closed ? status.right.opened : status.right.closed))}, 300, function () {
					status.opened = !status.opened;
				})
			}

			var setEvolveHeight = function () {

				winH = $(window).height();

				console.log("evolve toggle", evolveToggle.input[0]);

				evolveToggle.input.css({height:winH + "px"});


				// $stage.css({width:winW*width});

				// events.dispatch("load-display", "trash-sim");


			}

			setTimeout(function () {

				

				$("#main-back").click(function () {
					controls[0].tool.animate({opacity:0}, 200);
					$("#settingstoggle").animate({right:status.right.closed}, 300, function () {
						status.opened = false;
					})
				});

				setEvolveHeight();

				$(window).resize(function () {

					setEvolveHeight();
				})

			}, 500)

			$scope.animateRefresh = function (complete) {

				toggle = false;
				$("#refreshfeedback").css({opacity:1});
		        $("#refreshfeedback").animate(
		        {
		            top:0, 
		            opacity:0
		        }, 
		        {
		            duration:1000, 
		            complete:function () { 
		                $("#refreshfeedback").css({top:g.isMobile() ? 60 : 20});
		               	complete();
						toggle = true;
		            }
		        }
		        )
			}

			$scope.open = function () {

				console.log("open settings ", status.opened);

				if (!isFocus() && toggle) {
					animateToggle(true);
				}
			}
			
		}
	}

}]);




