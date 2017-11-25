


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



var data = {
	name:"trash",
	width:5,
	height:5,
	trashRate:0.5,
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
				success:1,
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
				success:1,
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
				success:1,
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
				success:1,
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
				fail:-5
			},
			color:"#ff00ff"
		},
		{
			id:6,
			name:"move random",
			change:getRandom,
			points:{
				success:-2,
				fail:-5
			},
			color:"#ffff00"
		}
		]
	}
}



module.exports = {
	power:power,
	getRandom:getRandom,
	data:data
}