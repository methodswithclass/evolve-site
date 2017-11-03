app.directive("trashsimdata", function () {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		templateUrl:"assets/views/ga-apps/trash/trashsimdata.html",		
		link:function ($scope, element, attr) {

			setTimeout(function () {

				var total = $("#simdatainner").children().length;

				$("#simdatainner").children().each(function (index) {

					$(this).css({height:$("#simdatainner").height()/total});

				})

			}, 800);
			
			
		}

	}

});