app.directive("plot", ['data', 'utility', 'display.service', function (data, u, display) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='relative width80 height80 center'><div class='relative width height' id='innerplot'></div></div>",		
		link:function ($scope, element, attr) {


			var shared = window.shared;
			var g = shared.utility_service;
			var send = shared.send_service;
			var react = shared.react_service;
			var events = shared.events_service;

			var pdata = data.get("feedback");
			var total = pdata.genome;
			var spread = pdata.spread;

			var pointSize = g.isMobile() ? 4 : 2;

			var $inner = "#innerplot";

			// var plot = [];
			var plot;
			var plotContainers = [];
			var zeros = [];

			var animations = {
				x:true,
				y:true
			}





			for (i in total) {
				zeros[i] = 0;
			}

			var normalize = function (y) {

				if (y === undefined) {
					return y;
				}

				var plotHeight = $($inner).height();
				var dataHeight = spread.size;
				//var zero = dataHeight/2;
				var plotfactor = plotHeight/(dataHeight+1);

				var value = plotfactor*y;

				return value;
			}

			var getContainers = function () {

				var containers = [];

				plot.forEach(function (value, index) {

					containers.push(value.getContainer());
				})

				return containers;
			}


			var makeClass = function (y) {

				var style = document.createElement('style');
				style.type = 'text/css';
				var className = ".move-" + g.truncate(y, 0);
				style.innerHTML = className + " { transform: translate(0, y) }";
				document.getElementsByTagName('head')[0].appendChild(style);

				return className;
			}

			var point = function ($index) {

				var self = this;

				self.index = $index || "none";

				// console.log("point", $index, $($inner).width(), total, $index*$($inner).width()/total);

				self.coords = {x:$index*$($inner).width()/total, y:0};

				self.setYValue = function ($value) {

					
					var value = normalize($value);

					self.coords.y = (typeof $value !== "undefined" ? value : self.coords.y);

					return self.coords.y;
				}


				self.setXValue = function ($value) {


					var width = $($inner).width();

					// console.log("width", width);

					var value = $value*width/total;


					self.coords.x = (typeof $value !== "undefined" ? value : self.coords.x);

					return self.coords.x;
				}


				var animate = {
					types:{
						animate:"animate",
						velocity:"velocity",
						anime:"anime"
					}
				}

				animate.type = animate.types.animate;


				// console.log("create point", self.coords);

				var container = document.createElement("div");
				$(container).addClass("absolute black-back");
				container.style.id = "point-" + self.index;
				container.style.width = pointSize + "px";
				container.style.height = pointSize + "px";
				container.style.borderRadius = pointSize/2 + "px";
				container.style.left = self.setXValue($index) + "px";
				container.style.top = self.setYValue(0) + "px";
				
				if ($index !== null) {
					$($inner).append(container);
				}


				self.getContainer = function () {

					return container
				}

				self.stopAnimation = function () {

					$(container).stop(true, true);
				}

				self.getCoord = function (coord) {

					if (coord) {
						return self.coords[coord];
					}
					else {
						return self.coords;
					}
				}


				self.setCoordX = function ($value, duration) {


					var value = self.setXValue($value);

					// console.log("value", value);

					if (animate.type == animate.types.animate) {

						$(container).animate({left:value + "px"}, duration);
					}
					else if (animate.type == animate.types.velocity) {
					
						container.velocity({left:value + "px"}, {
							duration:duration
						})

					}
					else if (animate.type == animate.types.anime) {


						anime({
							targets: container,
							translateX: {value:value, duration:duration}
						})
					}

				}

				self.setCoordY = function ($value, duration) {

					var value = self.setYValue($value);

					// console.log("y coord", self.coords.y);

					if (animate.type == animate.types.animate) {

						$(container).animate({top:value + "px"}, duration);
					}
					else if (animate.type == animate.types.velocity) {
					
						container.velocity({top:value + "px"}, {
							duration:duration
						})

					}
					else if (animate.type == animate.types.anime) {


						anime({
							targets: container,
							translateY: {value:value, duration:duration}
						})
					}

					

				}

				

				self.destroy = function () {

					// console.log("destroy point", self.coords);

					$(container).remove();
					container = null;
				}

			}


			var Plot = function () {

				var self = this;

				self.total = total;

				var $plot = [];

				self.loop = function (callback) {

					$plot.forEach(function(value, index) {
						callback(value, index);
					})
				}

				self.add = function (point) {

					$plot[point.index] = point;
				}

				self.get = function (index) {

					if (index < self.total) {
						return $plot[index];
					}
					else if (index === undefined) {
						return $plot;
					}
					else {
						return new point(null);

					}
				}

				self.last = function () {

					return self.get(self.total-1);
				}

				self.lastIndex = function () {

					return self.total-1;
				}

				self.coords = function (options) {

					var index = options.index;
					var coord = options.coord;

					var point = self.get(index);

					// console.log("point", index, point, point.coords);

					if (point) {

						return point.getCoord(coord);
					}
					else {
						return {x:0, y:0};
					}
				}

				self.containers = function () {

					var cont = [];

					self.loop(function(p, i) {

						cont[i] = p.getContainer();
					})

					return cont;
				}

				self.destroy = function () {

					console.log("destroy plot");

					self.loop(function (p,i) {
						p.destroy();
					})

					$plot.length = 0;
					$plot = null;
					$plot = [];
				}

				self.create = function () {

					// self.destroy();

					$plot = [];

					console.log("create plot");

					for (var i = 0; i < self.total; i++) {
						self.add(new point(i));
					}
				}

			}

			var animate1 = {
				x:function (duration) {

					plot.loop(function ($value, $index) {

						$value.setCoordX($index, duration);
					})
				},
				y:function (dna, duration) {

					plot.loop(function ($value, index) {

						var value = Array.isArray(dna) ? dna[index] : (typeof dna !== "undefined" ? dna : $value.coords.y);

						$value.setCoordY(value, duration);
					})

				}
			}


			var changeX = function (duration) {

				if (animations.x) {

					animate1.x(duration);
				}
			}

			var changeY = function (dna, duration) {

				if (animations.y) {

					animate1.y(dna, duration);
				}
			}



			var stopPlot = function () {

				plot.loop(function (value, $index) {

					value.stopAnimation();
				})

			}


			var resetPlot = function () {
				stopPlot();
				changeplot(0, 100);
			}


			var second = false;
			var refreshCount = 0;
			var refreshTotal = 5;
			// var refreshTimer;

			var refreshUI = function (options) {

				var setArenaSize = function  () {

					var ed = u.correctForAspect({
						id:"plot",
						factor:g.isMobile() ? 0.5 : 0.35, 
						aspect:2, 
						width:$(window).width(), 
						height:$(window).height()
					})

					$(options.elems[1]).css({width:ed.width, height:ed.height});

				}

				var resizeWindow = function () {

					// setArenaSize();
					
					changeX(30)

					setTimeout(function () {
						changeY(undefined, 30);
					}, 200);
				
				}


				var refreshTimer = setInterval(function () {

					changeX(30);

					if (plot && plot.last()) {

						
						var width = $(options.elems[0]).width();

						var coord = plot.coords({index:plot.lastIndex(), coord:"x"});
						var compare = width;
						
						var diff = Math.abs(coord - compare);

						if (diff < 5) {
							// console.log("cancel", refreshTimer);
							clearInterval(refreshTimer);
						}

					}

				}, 400);

				$(window).resize(function () {

					resizeWindow();
				})


			}


			var destroyPlot = function () {

				if (plot) {
					plot.destroy();
				}
			}

			var createPlot = function () {

				destroyPlot();

				// console.log("create plot");

				plot = new Plot();

				plot.create();

				plotContainers = plot.containers();

				g.waitForElem({elems:[$inner, "#arena"]}, function (options) {
					refreshUI(options);
				});
			}

			var changeplot = function (dna, duration) {

				try {
					changeY(dna, duration);
				}
				catch(e) {
					console.log("changeplot error:", e.message);
					createPlot()
					changeY(dna, duration);
				}
			}


			react.push({
				name:"importplot",
				state:{
					changeplot:changeplot,
					changeX:changeX,
					createplot:createPlot,
					resetplot:resetPlot,
					stopPlot:stopPlot,
					refreshUI:refreshUI
				}
			});
			

		}

	}

}]);