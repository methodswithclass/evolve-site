app.directive("settings", ['global.service', "events.service", "react.service", function (g, events, react) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/settings.html",	
		link:function ($scope, element, attr) {


			// console.log("\n############\ncreate settings directive\n\n");

			var settingsWidth = 800;
			var width = 0.6;

			var toggle = true;
			var status = {opened:false, right:{opened:-20, closed:-settingsWidth}};
			$("#settingstoggle").css({right:status.right.closed});

			var winH = $(window).height();
			var winW = $(window).width();
			var $winH;

			var manual;
			// $scope.settings = {
			// 	gens:500,
			// 	runs:20,
			// 	goal:"max",
			// 	pop:100
			// };

			$scope.settings;

			react.subscribe({
				name:"resetInput",
				callback:function(x) {

					$scope.settings = x;
				}
			})

			var controls = [
			{
				name:"open",
				input:$("#opensettings"),
				tool:$("#opentool")
			}
			]

			var evolveToggle = {
				name:"evolve",
				input:$("#evolvetoggle")
			}

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
				$("#settingstoggle").animate({
					
					right:
					
					(
					 (!open_up || status.opened) 
					 ? status.right.closed

					 : (
					    (open_up || status.closed) 
					    ? status.right.opened 
					    : status.right.closed
					    )
					 )

				}, 
				{
					
					duration:300, 
					complete:function () {
						status.opened = !status.opened;

						if (!status.opened) {
							
							react.push({
					        	name:"manual",
					        	state:$scope.settings
					        })

						}
					}

				});

			}

			var setEvolveHeight = function () {

				$winH = $(window).height();

				winH = winH > $winH ? winH : $winH;

				console.log("evolve toggle", evolveToggle.input[0]);

				evolveToggle.input.css({height:winH + "px"});

			}

			var setupEvolve = function() {

				setEvolveHeight();

				$(window).resize(function () {

					setEvolveHeight();
				})
			}


			$scope.changeInput = function () {


				manual = {
		            gens:parseInt($("#gensinput").val()),
		            runs:parseInt($("#runsinput").val()),
		            goal:$("#goalinput").val(),
		            pop:parseInt($("#popinput").val())
		        }

		        console.log("on change input, manual", manual);

		        react.push({
		        	name:"manual",
		        	state:manual
		        })

		        return manual;
			}

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


			setTimeout(function () {

				$scope.settings = $scope.changeInput();

				$("#main-back").click(function () {

					animateToggle(false);
				});

				setupEvolve();

			}, 500)
			
		}
	}

}]);




