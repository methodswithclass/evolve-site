app.directive("digit", ['utility', 'events.service', 'react.service', 'global.service', 'api.service', 'display.service', function (u, events, react, g, api, display) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        template:"<div ng-include='getContentUrl()'></div>",		
		link:function ($scope, element, attr) {


			$scope.getContentUrl = function() {

		        return "assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/recognize/digit.html";
		    }


			var imageSize = 28;
		    var imageLength = imageSize*imageSize;
		    var whiteValue = 255;
		    $scope.image = [];
		    $scope.label = "";
		    $scope.output = [];


		    var displayParams = display.getParams();


			display.waitForElem("#arena", function () {


				console.log("set digit arena");

		    	var ed = u.correctForAspect({
					id:"digit",
					factor:1.2, 
					aspect:2, 
					width:$(window).width(), 
					height:$(window).height(),
					window:true
				})

				$("#arena").css({width:ed.width, height:ed.height});

			})


			display.waitForElem("#digit-canvas", function () {

				console.log("set digit canvas");


				var ed = u.correctForAspect({
					id:"digit-canvas",
					factor:1, 
					aspect:1, 
					width:$("#digit-arena").width(), 
					height:$("#digit-arena").height(),
					window:true
				})

				$("#digit-canvas").css({width:ed.width, height:ed.height});
			})


		    var indexes = {
		    	index:0,
		    	sample:0
		    }


		    react.subscribe({
		    	name:"indexes",
		    	callback:function (x) {

		    		indexes = x;
		    	}
		    })

		    var makeImage = function (imageData, output, label) {

		    	$scope.image = [];
		    	$scope.label = label;
		    	$scope.output = output;

		        var row = [];
		        var i = 0;
		        var k = 0;
		        var j = 0;
		        while (j < imageSize) {

		            row = [];
		            k = 0;
		            while(k < imageSize) {

		                row.push(whiteValue-imageData[i++]);
		                k++;
		            }

		            j++;

		            $scope.image.push(row);
		            
		        }

		        setTimeout(function () {

		        	$(".imagerow").css({height:($("#digit-canvas").height()/10/4) + "px"});
		    		$(".imagepixel").css({width:$(".imagerow").height() + "px"});

		    		console.log("imagerow, pixel", $(".imagerow").height(), $(".imagepixel").width());

		        }, 500)

		    }

		    var eraseImage = function () {

		    	$scope.image = [];

		    	for (var i in $scope.image) {

		    		for (var j in $scope.image[i]) {

		    			$scope.image[i][j] = whiteValue;
		    		}
		    	}
		    }

		    var makeSubImage = function (imagedata, quad) {

		        var row = [];

		        var j = quad*imageSize/2;
		        var k = quad*imageSize/2;

		        var jMax = (quad+1)*imageSize/2;
		        var kMax = (quad+1)*imageSize/2;

		        $scope.images[quad] = [];

		        while (j < jMax) {

		            row = [];
		            k = quad*imageSize/2;
		            
		            while(k < kMax) {

		                row.push(imagedata[j][k]);
		                k++;
		            }

		            j++;

		            $scope.images[quad].push(row);
		        }

		    }

		    
		    var getDigit = function (i) {


		    	display.setElemScrollTop("#loadingtoggle");

		    	u.toggle("show", "loading", {fade:displayParams.fade});

		        api.simulate.digit(i, function (res) {

		        	u.toggle("hide", "loading", {fade:displayParams.fade});

		        	display.setElemScrollTop("#loadingtoggle", 0);

		        	makeImage(res.data.image, {}, res.data.label);

		        	u.toggle("enable", "play", {fade:displayParams.fade, delay:displayParams.delay})
		        })

		    }

		    var displayOutput = function (output) {

		    	$scope.output = output;
		    }


		    events.on("createDigit", function () {

		    	getDigit(indexes.index);
		    })


		    events.on("resetDigits", function () {

		    	eraseImage();
		    })

		    events.on("imageFunctions", function () {

		    	react.push({
		    		name:"imageFunctions",
		    		state:{
		    			makeImage:makeImage,
		    			eraseImage:eraseImage,
		    			displayOutput:displayOutput
		    		}
		    	})
		    })

		}


	}


}]);


