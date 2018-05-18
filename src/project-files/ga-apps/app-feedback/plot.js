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
				var plotfactor = plotHeight/(dataHeight+1);

				var value = plotfactor*y;

				// console.log(plotHeight, dataHeight, plotfactor, value, y);

				//console.log(value);

				return value;
			}


			var makeClass = function (y) {

				var style = document.createElement('style');
				style.type = 'text/css';
				var className = ".move-" + g.truncate(y, 0);
				style.innerHTML = className + " { transform: translate(0, y) }";
				document.getElementsByTagName('head')[0].appendChild(style);

				return className;
			}

			var point = function (x, $index) {

				var self = this;

				self.index = $index;

				self.coords = {x:x, y:0};

				// console.log("create point", self.coords);

				var container = document.createElement("div");
				$(container).addClass("absolute black-back");
				container.style.id = "point-" + self.index;
				container.style.width = pointSize + "px";
				container.style.height = pointSize + "px";
				container.style.borderRadius = pointSize/2 + "px";
				container.style.left = self.coords.x + "px";
				container.style.top = normalize(self.coords.y) + "px";
				
				$inner.append(container);

				self.changeY = function (dna, duration) {

					// var currentCoord = normalize($(container).position().top);
					// // console.log("current", currentCoord);
					self.coords.y = ((typeof dna !== "undefined") 
					                ? (Array.isArray(dna) 
					                   ? (typeof dna[self.index] !== "undefined" 
					                      ? dna[self.index] 
					                      : self.coords.y) 
					                   : parseFloat(dna)) 
					                : self.coords.y);
					// // console.log("newvalue", newValue, dna);
					var nextCoord = normalize(self.coords.y);

					// var topProp = {top:nextCoord}
					// var transProp = [
					// 	{transform:"translateY(currentCoord)"},
					// 	{transform:"translateY(nextCoord)"}
					// ]

					// var transProp2 = {"-webkit-transform":"translate(0,"+nextCoord+"px)"}

					// // console.log("currentcoord", currentCoord, "nextcoord", nextCoord);

					// $(container).animate(topProp, {
					// 	duration:duration
					// });


					var className = makeClass(nextCoord);

					$(container).addClass(className);

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

				plot.forEach((value, index) => {

					value.changeY(dna, duration);
				})

			}

			var resetPlot = function () {
				changeplot(0, 300);
			}


			var setArenaSize = function  () {

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
						factor:g.isMobile() ? 0.7 : 0.3, 
						aspect:2, 
						width:$(window).width(), 
						height:$(window).height()
					})

					$("#arena").css({width:ed.width, height:ed.height});

				})

			}


			setArenaSize();

			$(window).resize(() => {

				setArenaSize();
			})

		}

	}

}]);