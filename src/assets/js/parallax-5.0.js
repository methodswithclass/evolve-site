/***********************************************************************************
  
		Parallax Module v5.0

		AngularJS library with no other dependencies	

		scrolls an image or DOM element at reduced rate compared to document scroll. 
		Takes image source or child element as input.

		contents:
		parallax scrolling directive


		Methods with Class, LLC, 2018


***********************************************************************************/



// import this module into your project
var parallax = angular.module("parallaxModule", []);


// determines whether current device can use parallax scrolling. IE and mobile devices return false.
parallax.factory("util", function () {

	var valid = function() {

		if (navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('Chrome') != -1 || navigator.userAgent.indexOf('Safari') != -1) {

			return true;
		}

		return false;
	}

	var waitForElem = function (options, complete) {

		var c = {
			noexist:"noexist",
			found:"found",
			notfound:"notfound"
		}

        var count = 0;
        var result = false;
        var active = []

        var checkElements = function (array) {

        	if (array === undefined || array === null) {
        		return c.noexist;
        	}

        	result = c.found;
        	active = [];

        	if (Array.isArray(array)) {

        		// console.log("###################\n\n\n\n\n\narray is array \n\n\n\n\n\n################")

        		for (var i in array) {

        			// console.log("element", array[i], "does not exist");

	        		if ($(array[i])[0]) {
	        			active.push(true);
	        		}

        		}


	        	if (active.length >= array.length) {

	        		result = c.found;
	        	}
	        	else {
	        		result = c.notfound;
	        	}

        	}
        	else {

        		// console.log("@@@@@@@@@@@@@@@@\n\n\n\n\n\n\n\n\array is single\n\n\n\n\n\n@@@@@@@@@@@@@@")

        		if ($(array)[0]) {
        			// console.log("element does not exist");
        			result = c.found;
        		}
        		else {
        			result = c.notfound;
        		}

        	}

        	return result;
        }

        var stopTimer = function () {

        	clearInterval(waitTimer);
            waitTimer = null;
        }

        var waitTimer = setInterval(function () {


        	if (checkElements(options.elems) == c.noexist) {
        		stopTimer();
        	}
			else if (checkElements(options.elems) == c.found || count >= 500) {

            	// console.log("clear interval");

            	stopTimer();

                if (count < 500) {

                	// console.log("run complete");
                    
                    if (typeof complete === "function") complete(options);
                }
                else {

                	// console.log("count limit reached");
                }
                
            }
            else {

                count++;
            }

        }, 30);
    }


 //    // adjusts the size of the image (defined in the directive 'src') to always be bigger than the parent
	var fixInside = function (params) {

		var $i = params.inside;
    	var $s = params.space;
    	
    	var $iw = $i.width;
    	var $ih = $i.height;
    	var $sw = $s.width;
    	var $sh = $s.height;

    	var $ar = $iw/$ih;

		var goodAspect = function (width, height) {
			if (Math.abs($iw/$ih - $ar) < 0.01) return true;
			return false;
		}

		var checkHeight = function ($h) {
	        if ($h < $sh) return "under";
	        else if ($h > $sh*1.2) return "over";
	        return "good";
	    }

	    var checkWidth = function ($w) {
	        if ($w < $sw) return "under";
	        else if ($w > $sw*1.2) return "over";
	        return "good";
	    }


	    var fixHeight = function ($w, $h) {

	    	$h = $sh*1.2;
            $w = $h*$ar;

            return {
            	width:$w,
            	height:$h
            }
	    }


	    var fixWidth = function ($w, $h) {

	    	$w = $sw*1.2;
            $h = $w/$ar;

            if (checkHeight($h) == "under") {
               return fixHeight($w, $h)
            }

            return {
            	width:$w,
            	height:$h
            }
	    }


        if (checkWidth($iw) == "under") {
            return fixWidth($iw, $ih);
        }

        // console.log("adjust image", $w, $h);

        return {
        	width:$iw,
        	height:$ih
        }

    }

    // generally solves a system of two linear equations 
    var linear = function (params) {

		var y1 = params.y1;
		var y2 = params.y2;
		var x1 = params.x1;
		var x2 = params.x2;
		var m;
		var b;

		if (x2 != x1) {
			
			m = (y2-y1)/(x2-x1);
			b = y1 - x1*m;

		}
		else {
			m = 0;
			b = 0;
		}

		return {
			m:m,
			b:b
		}

	}

	return {
		fixInside:fixInside,
		linear:linear,
		valid:valid,
		waitForElem:waitForElem
	}


});


// add this directive to the element you want to add a parallax scrolling element too
parallax.directive('parallax', ['util', function (u) {



	// link function, see below for parameters
	var link = function ($scope, element, attr) {



		var inner;
		var img;
		var top;
		var active = false;
		var factor = 1;

		var o;
		var elemheight;
		var innerheight;
		var imageheight;
		var bodyheight;

		var eqs;

		// if src is defined, add the image to the parent div dynamically, called when loaded
		var setup = function (options, complete) {

			var $scope = options.$scope;
			var element = options.element;
			var attr = options.attr;
			var $options = options.$options;

			$(element).css({
				overflow:"hidden"
			});

			if ($scope.src && !$scope.inner) {

				active = true;


				inner = document.createElement("div");
				$(element).append(inner);

				// container div is always 150% taller than parent to allow enough room to parallax scroll
				$(inner).css({
					position:"absolute", 
					height:"150%", 
					width:"100%", 
					backgroundColor:"white", 
					zIndex:-50, 
					opacity:0.99
				});

				img = document.createElement("img");
				img.src = $scope.src;
				img.id = $scope.imgId;
				$(inner).append(img);


				// image is centered with in container, this is what is adjusted by fix()
				$(img).css({
					position:"absolute", 
					top:"50%", 
					left:"50%",
					// "margin-right":"-50%",
					transform: 'translate(-50%, -50%)',
					MozTransform: 'translate(-50%, -50%)',
					WebkitTransform: 'translate(-50%, -50%)',
					msTransform: 'translate(-50%, -50%)'
					
				});

			}
			else if ($scope.inner && !$scope.src) {
				active = true;

				// console.log("inner", $options.elems[1]);
				inner = $(element).find("#" + $scope.inner)[0];
			}

			elemheight = $(element).height();
			innerheight = $(inner).height();

			if (typeof complete === "function") complete();
		}


		var getEqs = function (options, $ih) {

			var $scope = options.$scope;
			var element = options.element;
			var attr = options.attr;
			var $options = options.$options;

			var xBuffer = 100;
			var yBuffer = 20;


			var bodyheight = $($options.elems[0]).height();

			// console.log("version 5", $scope.name, "sh:", elemheight, " ph:", innerheight, " ih:", $ih, " h:", bodyheight);

			if (!$scope.top) {

				// console.log("equation", $scope.name ? $scope.name : "", "is linear");

				eqs = u.linear({
					x1:(-1)*xBuffer,
					y1:(-1)*yBuffer,

					x2:bodyheight + xBuffer,
					y2:(elemheight-innerheight) + yBuffer
				});

			}
			else {
				// console.log("equation", $scope.name ? $scope.name : "", "is simple");
				eqs = {m:-0.99, b:(elemheight-innerheight)/2};
			}

			// console.log($scope.name, "m:" + eqs.m + " b:" + eqs.b);

		}


		// get parallax scroll parameters, solve linear equation for current values, called when loaded and anytime the window is resized
		var reset = function (options) {

			var $scope = options.$scope;
			var element = options.element;
			var attr = options.attr;
			var $options = options.$options;

			var $inner = $options.elems[1];

			// console.log("options", $options.elems, inner);

			var ed = u.fixInside({
				inside:{
					width:$($inner).width(), 
					height:$($inner).height()
				}, 
				space:{
					width:$(element).width(),
					height:$(element).height()
				}
			});


			if ($scope.adjustinner) {
			// if (true) {
				$($inner).css({width:ed.width, height:ed.height});
			}

			getEqs(options, (img ? ed.height : innerheight));
			
		}

		// changes height of parallax scrolling element based on element offset compared to top of scrolling element
		var scroll = function (options) {
			

			var $scope = options.$scope;
			var element = options.element;
			var attr = options.attr;
			var $options = options.$options;

			// if device is desktop and a parallax scrolling element is defined
			if (u.valid() && active) {

				// getEqs(options, (img ? $(img).height() : ih));

				// if ($scope.name == "evolve" || $scope.name == "top") console.log($scope.name, "m:" + eqs.m + " b:" + eqs.b);

				o = $(element).offset().top;

				// console.log("offset", $scope.name, $(element).offset().top);

				top = o*eqs.m*factor + eqs.b;

				$($options.elems[1]).css({top:top});
			}

			//console.log("version 1 factor: " + factor);
		}

		var runResetAndScroll = function (options) {


			var $options = options.$options;

			reset(options);
			scroll(options);

			$(window).resize(function () {
				reset(options);
				scroll(options);
			});

			// console.log("parallax options", $options, [
			//             {"scroll":$($options.elems[0])[0]},
			//             {"inner":$($options.elems[1])[0])}
			// ]);

			$($options.elems[0]).scroll(function () {

				// console.log(($($options.elems[0])[0] ? "parallax" : "no parallax"), "scroll");
				// reset(options);
				scroll(options);
			});
		}


		// console.log("parallax scope", [
		//             {"name": $scope.name}, 
		//             {"src": $scope.src},
		//             {"imgID": $scope.imgId},
		//             {"inner": $scope.inner},
		//             {"scroll": $scope.scroll},
		//             {"top": $scope.top},
		//             {"factor": $scope.factor},
		//             {"adjustinner": $scope.adjustinner}
		// ])

		
		factor = $scope.factor ? parseFloat($scope.factor) : factor;
		
		if (factor < 0 || factor >= 0) {
			// console.log("factor is", factor);
		}
		else {
			console.log("factor is indeterminate for", $scope.name + ",", "set factor to 1");
			factor = 1;
		}

		u.waitForElem({elems:["#" + $scope.scroll]}, function (options) {

			options.$scope = $scope;
			options.element = element;
			options.attr = attr;

			setup(options, function () {
					
				u.waitForElem({elems:["#" + $scope.scroll, "#" + ($scope.inner ? $scope.inner : $scope.imgId)]}, function ($options) {
					options.$options = $options;
					runResetAndScroll(options);
				})

			});

		})


	}

	return {
		scope:{
			name:"@", 	// identifier. 						optional. debugging
			src:"@",	// image source. 					optional. required if inner is not defined, must be one, can't be both
			imgId:"@", 	// parallax parent element id
			inner:"@", 	// child element    id. 			optional. required if src is not defined, must be one, can't be both
			scroll:"@", // overflow:scroll 	id.			 	required. 
							// this module requires manual element overflow:scroll, 
							// it will not work with only the default window scroll
			top:"=", 	// is top or not 	boolean 		optional. true if the element has a zero offset when loaded
			factor:"=",	// multiplier		number			optional.	mulitplier to adjust speed of parallax effect as desired.
			adjustinner:"=" // to adjust the size of the inner element or not 		boolean
		},
		link:link
	};


}]);