


var data = {
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
}


module.exports = {
	data:data
}