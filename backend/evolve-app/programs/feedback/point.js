


var points = [];
var pointContainers = [];


var plot = function (options) {


	var self = this;

	var container
}




var point = function ($index, options) {

	var self = this;

	self.index = $index;

	self.coords = {x:$index*$inner.width()/total, y:0};

	var pointSize = options.mobile ? 4 : 2;

	// console.log("create point", self.coords);

	// var container = document.createElement("div");
	// container).addClass("absolute black-back");
	// container.style.id = "point-" + self.index;
	// container.style.width = pointSize + "px";
	// container.style.height = pointSize + "px";
	// container.style.borderRadius = pointSize/2 + "px";
	// container.style.left = self.coords.x + "px";
	// container.style.top = normalize(self.coords.y) + "px";

	var container = "<div class='absolute black-back' id='point-" + self.$index + "' style='width:"+pointSize+"; height:"+pointSize+"; borderRadius:"+pointSize/2+"left:"+self.coords.x+"px; top:"+normalize(self.coords.y)+"px'></div>"
	
	options.inner.append(container);


	self.getContainer = function () {

		return container
	}

	self.stopAnimation = function () {

		// $(container).stop(true, true);
	}

	self.setCoordX = function (value, duration) {

		self.coords.x = value !== "undefined" ? value : self.coords.x;

		anime({
			targets: container,
			translateX: {value:value, duration:duration}
		})
	}


	self.setCoordY = function ($value, duration) {

		self.coords.y = typeof $value !== "undefined" ? $value : self.coords.y;

		var value = normalize(self.coords.y);

		anime({
			targets: container,
			translateY: {value:value, duration:duration}
		})

	}


	self.getYValue = function ($value) {

		self.coords.y = typeof $value !== "undefined" ? $value : self.coords.y;

		var value = normalize(self.coords.y);

		return value;
	}


	self.getXValue = function (value) {

		self.coords.x = value !== "undefined" ? value : self.coords.x;

		return self.coords.x;
	}

	

	self.destroy = function () {

		$(container).remove();
		container = null;
	}

}



var destroyPlot = function () {

	console.log("destroy plot");

	// for (var i in plot) {

	// 	plot[i].destroy();
	// }

	points.forEach(function (value, index) {

		value.destroy();
	})

	points.length = 0;
	points = null;
	points = [];



}

var createPlot = function (options) {

	destroyPlot();


	console.log("create plot");

	points = [];


	for (var i = 0; i < total; i++) {
		points[i] = new point(i, options);
		// console.log("new point", plot[i].coords);
	}





	pointContainers = getContainers();
}




module.exports = point;