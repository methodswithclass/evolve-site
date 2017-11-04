


var d = require("../../data/programs/trash.js");
var environment = require("./environment.js");


var actions = d.data.actions;
var plan;
var position = {x:0, y:0};
var stage = {
	min:0,
	max:d.data.width-1
}

var move = function (diff) {

	position.x += diff.x;
	position.y += diff.y;

	var success = "success";

	if (position.x < 0){
		success = "wall";
		position.x = 0;
	}
	else if (position.x > stage.max) {
		success = "wall";
		position.x = stage.max;
	}

	if (position.y < 0) {
		success = "wall";
		position.y = 0;
	} 
	else if (position.y > stage.max) {
		success = "wall";
		position.y = stage.max;
	}

	return success;

}

var reset = function () {

	position = {x:0, y:0};
}

var instruct = function (_plan) {

	// console.log("receive instructions", _plan);
	plan = _plan;
}

var update = function () {

	var pre = {x:position.x, y:position.y};
	var state = environment.assess(pre);
	
	var id = plan[state];

	var success = "success";

	// console.log("update", actions, actions.list, plan, state);

	if (actions.list[id].name == "clean") {
		success = environment.clean(pre);
	}
	else {
		success = move(actions.list[id].change());
	}

	return {
		state:state,
		action:actions.list[id],
		move:{
			pre:{x:pre.x, y:pre.y},
			post:{x:position.x, y:position.y}
		},
		success:success
	}
}


module.exports = {
	reset:reset,
	instruct:instruct,
	update:update
}



