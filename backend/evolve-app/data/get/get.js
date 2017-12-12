

// var evolveFact = require("mc-evolve");
var evolveFact = require("../../__ga/evolve.js");

var SESSION_EXPIRY = 3600*24*1000;

var evolve = {};

var data = function (name) {

	console.log("get data", __dirname);

	return require("../programs/" + name + ".js");
}



var programs = function (program, module) {

	return require("../../programs/" + program + "/" + module + ".js")
}


var clearSessions = function () {

	var now = (new Date()).getTime();

	for (var i in evolve) {

		if (!evolve[i].expires || now > evolve[i].expires) {
			delete evolve[i]
		}

	}
}


var makeEvolve = function () {

	return new evolveFact.module();
}

var makeProgram = function (program, options) {

	var module = program;
	var progArray = program.split("/");
	module = progArray.length > 1 ? progArray[1] : program;

	var prog = programs(program, module);

	return new prog(options);
}


var createSessionEvolve = function (session) {

	console.log("create session", session);

	clearSessions();

	var now = new Date();
	var nowMilli = now.getTime();
	var expires = new Date(nowMilli + SESSION_EXPIRY);

	evolve[session] = {};
	evolve[session].evolve = makeEvolve();
	evolve[session].expires = expires.getTime();
	
	return evolve[session].evolve;
}

var addProgramToSession = function (session, program, options) {

	console.log("add program to session", session, program);

	evolve[session].programs = {};
	evolve[session].programs[program] = makeProgram(program, options);

	return evolve[session].programs[program];
}

var getSession = function (session) {

	return evolve[session];
}

var getSessionEvolve = function (session) {

	return evolve[session].evolve;
}

var getSessionProgram = function (session, name) {

	return evolve[session].programs[name];
}



module.exports =  {
	data:data,
	programs:programs,
	createSessionEvolve:createSessionEvolve,
	addProgramToSession:addProgramToSession,
	getSession:getSession,
	getSessionEvolve:getSessionEvolve,
	getSessionProgram:getSessionProgram
}