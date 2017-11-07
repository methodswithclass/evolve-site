

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
	module = progArray.length > 0 ? progArray[1] : program;

	var prog = programs(program, module);

	return new prog();
}


var createSession = function (session) {

	evolve[session] = {};

	evolve[session].evolve = makeEvolve();

	return evolve[session];
}

var addProgramToSession = function (session, program) {

	evolve[session].programs = {};
	evolve[session].programs[program] = makeProgram(program);

	return evolve[session];
}

var getSession = function (session) {

	return evolve[session];
}

var getSessionProgram = function (session, name) {

	return evolve[session].programs[name];
}



module.exports =  {
	data:data,
	programs:programs,
	createSession:createSession,
	addProgramToSession:addProgramToSession,
	getSession:getSession,
	getSessionProgram:getSessionProgram
}