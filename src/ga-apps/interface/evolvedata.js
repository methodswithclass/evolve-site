app.directive("evolvedata", function () {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		templateUrl:"assets/views/ga-apps/interface/evolvedata.html",		
		link:function ($scope, element, attr) {
			
			var winW = $(window).width();
			var winH = $(window).height();

			var effW = winW - 20 - 100 - 300 - 30;
			var effH = winH - 20 - 20 - 30;
			var effHsim = winH - 20 - 20 - 30 - 200;

			var max = Math.min(effW, effH - 100);

			setTimeout(function () {

				$("#evolvedata").css({width:effW*0.9});
			}, 500);
		}

	}

});