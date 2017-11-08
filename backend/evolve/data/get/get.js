

var evolveFact = require("mc-evolve");


var evolve = {};

var data = function (name) {

	console.log("get data", __dirname);

	return require("../programs/" + name + ".js");
}



var programs = function (program, module) {

	return require("../../programs/" + program + "/" + module + ".js")
}



var makeEvolve = function () {

	return new evolveFact.module();
}

var makeProgram = function (program) {

	var module = program;
	var progArray = program.split("/");
	module = progArray.length > 1 ? progArray[1] : program;

	var prog = programs(program, module);

	return new prog();
}


var createSessionEvolve = function (session) {

	console.log("create session", session);

	evolve[session] = {};

	evolve[session].evolve = makeEvolve();

	return evolve[session].evolve;
}

var addProgramToSession = function (session, program) {

	console.log("add program to session", session, program);

	evolve[session].programs = {};
	evolve[session].programs[program] = makeProgram(program);

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