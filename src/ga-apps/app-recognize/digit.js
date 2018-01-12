app.directive("digit", ['utility', 'events.service', 'react.service', 'global.service', 'api.service', 'display.service', function (u, events, react, g, api, display) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/common/ga-apps/recognize/digit.html",		
		link:function ($scope, element, attr) {


			var imageSize = 28;
		    var imageLength = imageSize*imageSize;
		    var whiteValue = 255;
		    $scope.image = [];
		    $scope.label = "";
		    $scope.output = [];


		    var displayParams = display.getParams();


		    var setupDigit = function () {

		    	console.log("setup digit function");

				display.waitForElem({elems:"#arena"}, function (options) {


					console.log("set digit arena");

			    	var ed = u.correctForAspect({
						id:"digit",
						factor:0.8, 
						aspect:2, 
						width:$(window).width(), 
						height:$(window).height()
					})

					$("#arena").css({width:ed.width, height:ed.height});

				})


				display.waitForElem({elems:["#digit-arena", "#digit-canvas"]}, function (options) {

					console.log("set digit canvas");


					var ed = u.correctForAspect({
						id:"digit-canvas",
						factor:0.5, 
						aspect:1, 
						width:$("#digit-arena").width(), 
						height:$("#digit-arena").height()
					})


					console.log("digital canvas width height", ed.width, ed.height);

					$("#digit-canvas").css({width:ed.width, height:ed.height});
				})

			}


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

		    	u.toggle("disable", "refresh", {fade:displayParams.fade});
		    	u.toggle("hide", "settings", {fade:displayParams.fade});
		    	u.toggle("hide", "controls", {fade:displayParams.fade});
		    	u.toggle("show", "loading", {fade:displayParams.fade});

		        api.simulate.digit(i, function (res) {

		        	u.toggle("hide", "loading", {fade:displayParams.fade});
		        	u.toggle("show", "settings", {fade:displayParams.fade});
		        	u.toggle("show", "controls", {fade:displayParams.fade});
		        	u.toggle("enable", "refresh", {fade:displayParams.fade});
		        	u.toggle("enable", "play", {fade:displayParams.fade, delay:displayParams.delay})

		        	display.setElemScrollTop("#loadingtoggle", 0);

		        	makeImage(res.data.image, {}, res.data.label);

		        })

		    }

		    var displayOutput = function (output) {

		    	output = output.sort(function (a, b) {

					return b.output - a.output;
				})

		    	$scope.output = output;
		    }


		    events.on("createDigit", function () {

		    	getDigit(indexes.index);
		    })


		    events.on("resetDigit", function () {

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

		    events.on("setup-digit", function () {

		    	setupDigit();
		    })

		}


	}


}]);


