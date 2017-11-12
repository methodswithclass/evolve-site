app.directive("settings", ['global.service', function (g) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        template:"<div ng-include='getContentUrl()'></div>",	
		link:function ($scope, element, attr) {



			$scope.getContentUrl = function() {
    
		        var view;

		        if (g.isMobile()) {

		            view = "assets/views/mobile/ga-apps/interface/settings.html";
		        }
			    else {
			        view = "assets/views/desktop/ga-apps/interface/settings.html";
			    }

		        return view;
		    }


			var toggle = true;
			var status = {opened:false, right:{opened:-20, closed:-400}};
			$("#settingstoggle").css({right:status.right.closed});

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

			var animateToggle = function () {

				controls[0].tool.animate({opacity:0}, 200);
				$("#settingstoggle").animate({right:status.opened ? status.right.closed : status.right.opened}, 300, function () {
					status.opened = !status.opened;
				})
			}

			setTimeout(function () {

				$("#main-back").click(function () {
					controls[0].tool.animate({opacity:0}, 200);
					$("#settingstoggle").animate({right:status.right.closed}, 300, function () {
						status.opened = false;
					})
				});

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
		                $("#refreshfeedback").css({top:20});
		               	complete();
						toggle = true;
		            }
		        }
		        )
			}

			$scope.open = function () {

				console.log("open settings ", status.opened);
				var maxHeight = $(window).height()*0.8;
				$("#settingstoggle").css({height:maxHeight < 800 ? maxHeight : 800});
				if (!isFocus() && toggle) {
					animateToggle();
				}
			}
		}
	}

}]);




