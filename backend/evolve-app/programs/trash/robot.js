


var d = require("../../data/programs/trash.js");



var robot = function () {

	var self = this;

	var actions = d.data.actions;
	var plan;
	var position = {x:0, y:0};
	

	var stage;

	var environment;

	var pre;
	var state;
	var id;

	var setInput = function (options) {

		stage = {
			width:options.grid.size,
			height:options.grid.size,
			min:0,
			max:options.grid.size - 1
		}
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

	self.setup = function (env, options) {

		environment = env

		setInput(options);
	}

	self.reset = function () {

		position = {x:0, y:0};
	}

	self.instruct = function (_plan) {

		// console.log("receive instructions", _plan);
		plan = _plan;
	}

	self.update = function () {

		pre = {x:position.x, y:position.y};
		state = environment.assess(pre);
		
		id = plan[state];

		// console.log("update", state, plan.length, id);

		var success = "success";

		if (actions.list[id].name == "clean") {
			success = environment.clean(pre);
		}
		else {
			success = move(actions.list[id].change());
		}

		return {
			state:state,
			id:id,
			action:actions.list[id],
			move:{
				pre:{x:pre.x, y:pre.y},
				post:{x:position.x, y:position.y}
			},
			success:success
		}
	}

}


module.exports = robot



