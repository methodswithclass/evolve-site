app.directive("digit", ['events.service', 'react.service', function (events, react) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        template:"<div ng-include='getContentUrl()'></div>",		
		link:function ($scope, element, attr) {


			$scope.getContentUrl = function() {
    
		        var view;

		        if (g.isMobile()) {

		            view = "assets/views/mobile/ga-apps/recognize/digit.html";
		        }
			    else {
			        view = "assets/views/desktop/ga-apps/recognize/digit.html";
			    }

		        return view;
		    }


			var imageSize = 28;
		    var imageLength = imageSize*imageSize;
		    var whiteValue = 255;
		    $scope.image = [];
		    $scope.label = "";
		    $scope.output = [];

		    setTimeout(function () {


		    	$("#digit-canvas").css({width:($("#digit").height() * 0.8) + "px", height:($("#digit").height() *0.8) + "px"});

		    	console.log("canvas", $("#digit-canvas").width(), $("#digit-canvas").height());

		    }, 100)


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

		        }, 100)

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

		    
		    var processAndMakeImage = function (i) {

		        // imageprocessor.getImage(i, "train", function (result) {

		        //     imageData = result;

		        //     console.log("image data", imageData.image.length, imageData.label ? imageData.label : "");

		        //     makeImage(imageData.image);

		        // });

		    }

		    // var makeImageFromProcessed = function (i, j) {

		    //     imageprocessor.getPreprocessedDataImage(i, j, function (result) {

		    //         imageData = result;

		    //         console.log("image data", imageData.label);

		    //         makeImage(imageData.image);
		    //     })

		    // }


		    events.on("createDigit", function () {

		    	processAndMakeImage(indexes.index);
		    })


		    events.on("resetDigits", function () {

		    	eraseImage();
		    })

		    events.on("imageFunctions", function () {

		    	react.push({
		    		name:"imageFunctions",
		    		state:{
		    			makeImage:makeImage,
		    			eraseImage:eraseImage
		    		}
		    	})
		    })

		}


	}


}]);


