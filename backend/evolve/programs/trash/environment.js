

var d = require("../../data/programs/trash.js");


var environment = function () {


	var self = this;

	var trashRate = d.data.trashRate;
	var stage = {
		width:d.data.width,
		height:d.data.height,
		min:0,
		max:d.data.width - 1
	}

	var env = {};

	self.get = function () {

		return env;
	}

	var block = function (x, y) {

		var self = this;

		self.pos = {x:x, y:y};

		self.trash = false;

		self.dirty = function () {
			self.trash = true;
		}

		self.clean = function () {
			self.trash = false;
		}

		self.isDirty = function () {

			return self.trash;
		}
	}

	self.trash = function () {

		var b;
		var ui;
		var check;

		for (var i in env.trash) {

			t = env.trash[i];

			b = env.arena[t.x][t.y];
			b.dirty();
			
			if (!b.trash) {
				console.log("flag **********************************************");
			}
			
		}

	}

	var replace = function () {

		var block;

		// env.arena = [];

		for (var i = 0; i < stage.width; i++) {
			// env.arena[i] = [];
			for (var j = 0; j < stage.height; j++) {
				block = env.arena[i][j];
				block.clean();
			}
		}

		self.trash();
	}

	self.make = function () {

		var col = [];
		var _arena = [];

		var ablock;
		var k = 0;

		for (var i = 0; i < stage.width; i++) {

			col = [];

			for (var j = 0; j < stage.height; j++) {

				ablock = new block(i,j);

				col[j] = ablock;
			}

			_arena[i] = col;
		}

		env.arena = _arena;
	}

	self.reset = function () {

		replace();
	}

	self.refresh = function () {

		var _trash = [];
		var k = 0;

		for (var i = 0; i < stage.width; i++) {
			for (var j = 0; j < stage.height; j++) {
				if (Math.random() < trashRate) {
					_trash[k] = {x:i, y:j};
					k++;
				}
			}
		}

		env.trash = _trash;

		replace();

		return _trash.length;
	}

	var check = function (pos) {

		var result = 0;

		if (pos.x < stage.min || pos.x > stage.max || pos.y < stage.min || pos.y > stage.max) {
			result = 2;
		}

		if (result == 0) {
			result = env.arena[pos.x][pos.y].trash ? 1 : 0;
		} 

		return result;
	}

	self.assess = function (pos) {


		var base = 3;

		var up = check({x:pos.x, y:pos.y-1});
		var down = check({x:pos.x, y:pos.y+1});
		var left = check({x:pos.x-1, y:pos.y});
		var right = check({x:pos.x+1, y:pos.y});
		var on = check(pos);

		var index = 0;

		index += up*Math.pow(base, 0);
		index += down*Math.pow(base, 1);
		index += left*Math.pow(base, 2);
		index += right*Math.pow(base, 3);
		index += on*Math.pow(base, 4);

		return index;

	}

	self.clean = function (pos) {

		var block = env.arena[pos.x][pos.y];

		var success = "success";

		if (block.trash) {
			block.clean();
			if (block.isDirty()) {
				success = "fail";
			}
		}
		else {
			success = "no trash";
		}

		return success;
	}

	self.createEnv = function () {

		self.make();

		self.refresh();

		return self.get();
	}


}

module.exports = environment;

