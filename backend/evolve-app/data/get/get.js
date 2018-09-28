

var evolveFact = require("mc-evolve");
// var evolveFact = require("../../@.ga/__.ga.js");
var g = require("mc-shared").utility_service;
// var g = require("../../__.ga/shared.js").utility_service;
const UIDGenerator = require('uid-generator');


const uidgen = new UIDGenerator();


var SESSION_EXPIRY = 3600*24*1000;

var evolve = {};

var getSessionId = function () {

	return uidgen.generateSync();
}

var data = function (name) {

	console.log("get data", name, __dirname);

	return require("../programs/" + name + ".js");
}

var makeProgramString = function ($options) {


	var program = $options.name ? $options.name : undefined;
	var options = $options.programInput ? $options.programInput : undefined;


	var programExists = g.doesExist(program);
	var optionsExists = g.doesExist(options.processType);

	console.log("process type", optionsExists, "\n\n\n");

	var programString;
	var typeString = "";


	if (programExists) {
		programString = program + "/" + program;
	}


	if (optionsExists) {
		typeString += "-types/" + program + "_" + options.processType + ".js";
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

var getSession = function (session) {

	return {
		evolve:evolve[session]
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


var createSessionEvolve = function () {

	console.log("create session", session);

	clearSessions();

	var session = getSessionId();

	var now = new Date();
	var nowMilli = now.getTime();
	var expires = new Date(nowMilli + SESSION_EXPIRY);

	evolve[session] = {};
	evolve[session].evolve = makeEvolve();
	evolve[session].expires = expires.getTime();
	
	return {
		evolve:evolve[session].evolve,
		session:session
	}
}

var addProgramToSession = function (input) {

	var name = input.name ? input.name : undefined;
	var sessionId = input.session ? input.session : undefined;
	
	var programString = makeProgramString(input);

	console.log("add program to session", sessionId, programString);


	if (g.doesExist(name) && g.doesExist(sessionId)) {

		var session = getSession(sessionId);

		if (session.programs && session.programs[name]) {
			console.log("program does not exist, make program");
			
			return {
				program:session.programs[name],
				pdata:data(input.name)
			}
		}


		session.programs = {};
		session.programs[name] = makeProgram(input);

		return {
			program:session.programs[name],
			pdata:data(input.name)
		}
	}
	else {

		return null;
	}
}

var getAllSessions = function () {

	return evolve;
}

var getSessionEvolve = function (session) {

	var session = getSession(session);

	if (!session) {

		session = createSessionEvolve();
	}

	return {
		evolve:session.evolve.evolve,
		session:session.session
	}
}

var getSessionProgram = function (session, name) {

	var session = getSession(session);

	if (!session) {
		
		session = createSessionEvolve();
		var program = addProgramToSession(session.session);

		return {
			program:program.program[name],
			session:session.session
		}
	}

	return {
		program:session.programs[name],
		session:session.session
	}
}

var sessionHardStop = function (session) {


	var evolve = getSessionEvolve(session);

	evolve.hardStop();
}



module.exports =  {
	data:data,
	getSessionId:getSessionId,
	programs:programs,
	createSessionEvolve:createSessionEvolve,
	addProgramToSession:addProgramToSession,
	getAllSessions:getAllSessions,
	getSession:getSession,
	getSessionEvolve:getSessionEvolve,
	getSessionProgram:getSessionProgram,
	sessionHardStop:sessionHardStop
}