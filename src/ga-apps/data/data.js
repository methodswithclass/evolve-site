

app.factory("data", function () {

	var imageWidth = 28;
	var imageHeight = 28;
	var imageLength = imageWidth*imageHeight;

	var imageRecognize = {
		network:[
		{
			nodes:imageLength
		},
		{
			nodes:16
		},
		{
			nodes:10
		}
		]
	}

	var fact = function (value) {

		if (value == 1) {
			return value;
		}
		else {
			
			var result = value * fact(value-1);

			//console.log(result);

			return result;
		}

	}

	var recognizeGenome = function (network) {

		var total = 0;

		for (var i = 1; i < network.length; i++) {

			total += (network[i-1].nodes + 1)*network[i].nodes;
		}

		return total;
	}

    var recognizeObjToArray = function (dnaObj) {

    	var dnaArray = [];

    	for (var i in dnaObj) {

    		for (var j in dnaObj[i]) {

    			for (var k in dnaObj[i][j]["weights"]) {

    				dnaArray.push(dnaObj[i][j]["weights"][k]);

    			}

    			dnaArray.push(dnaObj[i][j]["bias"]);
    		}
    	}

    	return dnaArray;

    }

    var recognizeArrayToObject = function (dnaArray) {

    	// console.log("inside array to object", dnaArray);

    	var dnaObj = [];
    	// dnaObj.push([]);
    	var m = 0;
    	var weights = [];

    	// console.log("network length", imageRecognize.network.length);

		for (var i = 1; i < imageRecognize.network.length; i++) {

    		dnaObj.push([]);

    		// console.log("layer", i, dnaObj);

			for (var j = 0; j < imageRecognize.network[i].nodes; j++) {

				dnaObj[i-1].push([]);

				// console.log("node with weight", i, j, dnaArray[m]);

				weights = [];

				for (var k = 0; k < imageRecognize.network[i-1].nodes; k++) {
					
					weights.push(dnaArray[m++]);

					if (k == imageRecognize.network[i-1].nodes - 1) {

						dnaObj[i-1][j]["bias"] = dnaArray[m++];

						dnaObj[i-1][j]["weights"] = weights;

						// console.log("weights", weights);
					}
				}
				
			}
			
		}

		// console.log("array to object, dna obj", dnaObj);

		return dnaObj;
    }

	var power = function () {

		var base = 3;
		var index = 1;

		index += 2*Math.pow(base, 0);
		index += 2*Math.pow(base, 1);
		index += 2*Math.pow(base, 2);
		index += 2*Math.pow(base, 3);
		index += 2*Math.pow(base, 4);

		return index;
	}

	var getRandom = function () {

		var test = Math.random();

		if (test < 0.25) {
			return {x:-1, y:0};
		}
		else if (test < 0.5) {
			return {x:1, y:0};
		}
		else if (test < 0.75) {
			return {x:0, y:-1};
		}
		else {
			return {x:0, y:1};
		}

	}


	var pcons = {
		feedback:{
			name:"feedback",
			spread:{
				size:100,
				target:0.5
			},
			threshold:{
				success:{
					value:0.01,
					points:10
				},
				fail:{
					value:0.49,
					points:-20
				}
			},
			genome:200,
			goals:[{goal:"converge"}, {goal:"diverge"}]
		},
		trash:{
			name:"trash",
			width:5,
			height:5,
			genome:power(),
			goals:[{goal:"max"}, {goal:"min"}],
			actions:{
				total:50,
				list:[
				{
					id:0,
					name:"move up",
					change:function () {
						return {x:0, y:-1}
					},
					points:{
						success:0,
						fail:-5
					},
					color:"#0000ff"
				},
				{
					id:1,
					name:"move down",
					change:function () {
						return {x:0, y:1}
					},
					points:{
						success:0,
						fail:-5
					},
					color:"#0000ff"
				},
				{
					id:2,
					name:"move left",
					change:function () {
						return {x:-1, y:0}
					},
					points:{
						success:0,
						fail:-5
					},
					color:"#0000ff"
				},
				{
					id:3,
					name:"move right",
					change:function () {
						return {x:1, y:0}
					},
					points:{
						success:0,
						fail:-5
					},
					color:"#0000ff"
				},
				{
					id:4,
					name:"stay put",
					change:function () {
						return {x:0, y:0}
					},
					points:{
						success:0,
						fail:0
					},
					color:"#00ffff"
				},
				{
					id:5,
					name:"clean",
					change:function () {
						return {x:0, y:0}
					},
					points:{
						success:10,
						fail:-1
					},
					color:"#ff00ff"
				},
				{
					id:6,
					name:"move random",
					change:getRandom,
					points:{
						success:0,
						fail:-5
					},
					color:"#ffff00"
				}
				]
			}
		},
		recognize:{
			name:"recognize",
			goals:[{goal:"max"}, {goal:"min"}],
			genome:recognizeGenome(imageRecognize.network),
			network:imageRecognize.network
		}
	}

	var get = function (name) {

		if  (name == "all") return pcons;

		for (var i in pcons) {

			if (pcons[i].name == name) {

				return pcons[i]
			}
		}


		return {};

	}

	return {
		get:get,
		recognizeObjToArray:recognizeObjToArray,
		recognizeArrayToObject:recognizeArrayToObject,
		recognizeGenome:recognizeGenome
	}

});