

// var evolveFact = require("mc-evolve");
var evolveFact = require("../../__ga/evolve_async.js");
var g = require("../../__ga/shared.js").utility_service;

var SESSION_EXPIRY = 3600*24*1000;

var evolve = {};

var data = function (name) {

	console.log("get data", __dirname);

	return require("../programs/" + name + ".js");
}

var makeProgramString = function ($options) {


	var program = $options.name ? $options.name : undefined;
	var options = $options.programInput ? $options.programInput : undefined;


	var programExists = g.doesExist(program);
	var optionsExists = g.doesExist(options);


	var programString;
	var typeString;


	if (programExists) {
		programString = program;
	}


	if (optionsExists) {
		typeString = "/" + program + "-types/" + program + "_" + options.processType + ".js";
	}

	
	programString += ((program == "trash") ? typeString : "");


	return programString;


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


var programs = function (input) {

	var programString = makeProgramString(input);

	return require("../../programs/" + programString)
}


var makeProgram = function (options) {

	// var module = options.name;
	// var progArray = program.split("/");
	// module = progArray.length > 1 ? progArray[1] : program;

	var prog = programs(options);

	return new prog(options.programInput);
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

var addProgramToSession = function (input) {

	var name = input.name ? input.name : undefined;
	var session = input.session ? input.session : undefined;
	
	var programString = makeProgramString(input);

	console.log("add program to session", session, programString);


	if (g.doesExist(name) && g.doesExist(session)) {

		if (evolve[session].programs && evolve[session].programs[name]) {
			console.log("program exists");
			return {
				program:evolve[session].programs[name],
				pdata:data(input.name)
			}
		}


		evolve[session].programs = {};
		evolve[session].programs[name] = makeProgram(input);

		return {
			program:evolve[session].programs[name],
			pdata:data(input.name)
		}
	}
	else {

		return null;
	}
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

var sessionHardStop = function (session) {


	var evolve = getSessionEvolve(session);

	evolve.hardStop();
}



module.exports =  {
	data:data,
	programs:programs,
	createSessionEvolve:createSessionEvolve,
	addProgramToSession:addProgramToSession,
	getSession:getSession,
	getSessionEvolve:getSessionEvolve,
	getSessionProgram:getSessionProgram,
	sessionHardStop:sessionHardStop
}