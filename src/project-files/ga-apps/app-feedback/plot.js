app.directive("plot", ['data', 'utility', 'display.service', function (data, u, display) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height'><div class='absolute width80 height80 center' id='innerplot'></div></div>",		
		link:function ($scope, element, attr) {


			var shared = window.shared;
			var g = shared.utility_service;
			var send = shared.send_service;
			var react = shared.react_service;
			var events = shared.events_service;

			var pdata = data.get("feedback");
			var total = pdata.genome;
			var spread = pdata.spread;

			var shared = window.shared.utility_service;

			var pointSize = g.isMobile() ? 4 : 2;

			var $inner = $("#innerplot");

			var plot = [];

			var zeros = [];

			for (i in total) {
				zeros[i] = 0;
			}

			var normalize = function (y) {

				var plotHeight = $inner.height();
				var dataHeight = spread.size;
				//var zero = dataHeight/2;
				var plotfactor = plotHeight/dataHeight;

				var value = plotfactor*y;

				//console.log(value);

				return value;
			}

			var point = function (x, $index) {

				var self = this;

				self.index = $index;

				self.coords = {x:x, y:0};

				// console.log("create point", self.coords);

				var container = document.createElement("div");
				$(container).addClass("absolute black-back");
				container.style.width = pointSize + "px";
				container.style.height = pointSize + "px";
				container.style.borderRadius = pointSize/2 + "px";
				container.style.left = self.coords.x + "px";
				container.style.top = normalize(self.coords.y) + "px";
				
				$inner.append(container);

				self.changeY = function (dna, duration) {

					self.coords.y = dna[self.index];

					$(container).animate({
						top:normalize(self.coords.y)
					}, 
	                {
						duration:duration, 
						complete:function () {

							// if (self.index+1 < plot.length) {
							// 	plot[self.index+1].changeY(dna, duration)
							// }

						}
					});
				}

				self.destroy = function () {

					// console.log("destroy point", self.coords);

					$(container).remove();
					container = null;
				}

			}

			var destroyPlot = function () {

				console.log("destroy plot");

				for (var i in plot) {

					plot[i].destroy();
				}

				plot.length = 0;
				plot = [];
				plot = null;
			}

			var createPlot = function () {

				destroyPlot();

				plot = [];

				console.log("create plot");

				for (var i = 0; i < total; i++) {
					plot[i] = new point(i*$inner.width()/total, i);
					// console.log("new point", plot[i].coords);
				}
			}

			var changeplot = function (dna, duration) {

				for (i in plot) {
				// if (plot.length > 0) {
					plot[i].changeY(dna, duration);
				}

				// var i = 0;
				// var isArray = Array.isArray(dna);
				// var timer = setInterval(function () {

				// 	if (i < plot.length) {
				// 		plot[i].changeY((isArray ? dna[i] : dna), duration);

				// 		i++;
				// 	}
				// 	else {
				// 		clearInterval(timer);
				// 		timer = null;
				// 		timer = {};
				// 	}

				// }, 10);
			}

			var resetPlot = function () {
				changeplot(0, 300);
			}


			g.waitForElem({elems:"#arena"}, function (options) {


				react.push({
					name:"importplot",
					state:{
						changeplot:changeplot,
						createplot:createPlot,
						resetplot:resetPlot
					}
				});

				var ed = u.correctForAspect({
					id:"plot",
					factor:0.5, 
					aspect:2, 
					width:$(window).width(), 
					height:$(window).height()
				})

				$("#arena").css({width:ed.width, height:ed.height});

			})

		}

	}

}]);