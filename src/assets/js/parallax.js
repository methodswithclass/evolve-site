/***********************************************************************************
  
		Parallax Module v2.2

		AngularJS library with no other dependencies	

		scrolls an image or DOM element at reduced rate compared to document scroll. 
		Takes image source or child element as input.

		contents:
		parallax scrolling directive


		Methods with Class, LLC, 2015


***********************************************************************************/



// import this module into your project
angular.module("parallaxModule", [])


// determines whether current device can use parallax scrolling. IE and mobile devices return false.
.factory("device", function () {

	var valid = function() {

		if (navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('Chrome') != -1 || navigator.userAgent.indexOf('Safari') != -1) {

			return true;
		}

		return false;
	}

	return {
		valid:valid
	}


})


// add this directive to the element you want to add a parallax scrolling element too
.directive('parallax', ['device', '$window', function (device, $window) {


	// link function, see below for parameters
	var link = function ($scope, element, attr) {


		// adjusts the size of the image (defined in the directive 'src') to always be bigger than the parent
		var fix = function (params) {

			var img = params.img;
	    	var space = params.space;
	    	var aspect;

			var goodAspect = function (width, height) {
				if (Math.abs(width/height - aspect) < 0.01) return true;
				return false;
			}

			var checkHeight = function (height) {
		        if (height < space.height()) return "under";
		        else if (height > space.height()*1.2) return "over";
		        return "good";
		    }

		    var checkWidth = function (width) {
		        if (width < space.width()) return "under";
		        else if (width > space.width()*1.5) return "over";
		        return "good";
		    }

	    	if ($(img)[0]) {

		    	if (params.first) aspect = img.width()/img.height();

		        var height = space.height()*1.2;
		        var width = height*aspect;
		        
		        if (checkWidth(width) == "under") {
		            //console.log("width under " + name);
		            width = space.width();
		            height = width/aspect;
		            if (checkHeight(height) == "under") {
		                //console.log("height under " + name);
		                height = space.height()*1.2;
		                width = height*aspect;
		            }
		        }
		        else if (checkWidth(width) == "over") {
		            //console.log("width over " + name);
		            width = space.width()*1.2;
		            height = width/aspect;
		            if (checkHeight(height) == "under") {
		                //console.log("height under " + name);
		                height = space.height()*1.2;
		                width = height*aspect;
		            }
		        }

		        img.css({height:height, width:width});
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
				b = x1*m + y1;
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

	    var $el = $("#" + $scope.scroll);
		var inner;
		var img;
		var top;
		var active = false;
		var factor = $scope.factor;

		if (factor === undefined) {
			factor = 1;
		}

		console.log("factor is", factor);

		var o;
		var sh;
		var ph;
		var ih;
		var h;
		var g;

		var mid;

		var eqs;

		// if src is defined, add the image to the parent div dynamically, called when loaded
		var setup = function () {

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
					backgroundColor:"black", 
					zIndex:-50, 
					opacity:0.99
				});

				img = document.createElement("img");
				img.src = $scope.src;
				$(inner).append(img);


				// image is centered with in container, this is what is adjusted by fix()
				$(img).css({
					position:"absolute", 
					height:"80%", 
					width:"auto", 
					top:"50%", 
					left:"50%",
					"margin-right":"-50%",
					transform: 'translate(-50%, -50%)',
 					MozTransform: 'translate(-50%, -50%)',
 					WebkitTransform: 'translate(-50%, -50%)',
 					msTransform: 'translate(-50%, -50%)'
					
				});

			}
			else if ($scope.inner && !$scope.src) {
				active = true;
				inner = $(element).find("#" + $scope.inner)[0];
			}

			sh = $(element).height();
			ph = $(inner).height();
		}



		// get parallax scroll parameters, solve linear equation for current values, called when loaded and anytime the window is resized
		var reset = function () {
			if (img) {
				fix({img:$(img), space:$(element), first:true});
			}
			ih = img ? $(img).height() : ph*0.8;
			g = (ph-ih)/2;
			h = $el.height();

			//console.log("sh:" + sh + " ph:" + ph + " ih:" + ih + " g:" + g + " h:" + h);

			if ($scope.top) {
				eqs = {m:-0.99, b:-1*(ph-sh)/2}
			}
			else if (ih < h) {

				eqs = linear({
					x1:2,
					y1:-1*g,

					x2:h-sh+2,
					y2:sh-ih-g
				});
			}
			else {
				eqs = {m:-0.99, b:-1*(ph-h)/2};
			}

			console.log("m:" + eqs.m + " b:" + eqs.b);
			
			
		}

		// changes height of parallax scrolling element based on element offset compared to top of scrolling element
		var scroll = function () {
			// if device is desktop and a parallax scrolling element is defined
			if (device.valid() && active) {

				o = $(element).offset().top - $el.offset().top;


				if (eqs) {
					top = o*eqs.m*factor + eqs.b;
					$(inner).css({top:top});
				}
			}

			//console.log("version 1 factor: " + factor);
		}

		// run setup() to initiate parallax elements when loaded
		setTimeout(function () {
			setup();
		}, 200);

		// run reset() to reset image size according to window size and re-calculate parallax parameters,
		// and run scroll() once on load to keep image from jumping when scrolling starts
		setTimeout(function () {
			reset();
			scroll();
		}, 500);

		// resize event: reset everything and run the parallax function
		angular.element($window).bind('resize', function () {
			reset();
			scroll();
		});

		// bind the top setting function for parallax to the scrolling event
		$el.bind('scroll', scroll);

	}

	return {
		scope:{
			name:"@", //identifier. optional. for debugging
			src:"@", //image source. optional. required if inner is not defined, can't be both
			inner:"@", // child element id. optional. required if src is not defined, can't be both
			scroll:"@", // overflow:scroll element id. required. nothing will work unless this module can detect scrolling and the top of the document is different than the top of the window
			top:"=", // boolean. optional. if a parallax scrolling element has a zero offset when loaded, it may be desired to have this behavior
			factor:"="
		},
		link:link
	};

}]);