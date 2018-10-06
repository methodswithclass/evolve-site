

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


var makeEvolve = function () {

	return new evolveFact.module();
}


var createSessionEvolve = function () {

	

	clearSessions();

	var sessionId = getSessionId();

	console.log("create session", sessionId);

	var now = new Date();
	var nowMilli = now.getTime();
	var expires = new Date(nowMilli + SESSION_EXPIRY);

	evolve[sessionId] = {};
	evolve[sessionId].evolve = makeEvolve();
	evolve[sessionId].expires = expires.getTime();
	
	return {
		session:evolve[sessionId],
		id:sessionId
	}
}

var setProgramForSession = function (sessionID, name, program) {

	if (evolve[sessionID]) {

		if (!evolve[sessionID].programs) {

			evolve[sessionID].programs = {};
		}

		evolve[sessionID].programs[name] = program;

		return true;
	}
	else {
		return false;
	}
}

var getSession = function (sessionId) {

	return {
		session:evolve[sessionId],
		id:sessionId
	}
}


var getAllSessions = function () {

	return evolve;
}

var getSessionEvolve = function ($sessionId) {

	var session = getSession($sessionId);

	if (!(session && session.session && session.session.evolve)) {

		console.log("session with id:", $sessionId, "does not exist, creating new session");

		session = createSessionEvolve();
	}

	return {
		evolve:session.session.evolve,
		id:session.id
	}
}



var addProgramToSession = function (input) {

	var name = input.name ? input.name : undefined;
	var sessionId = input.session ? input.session : undefined;
	
	//just for logging actual string retrieved in programs() func
	var programString = makeProgramString(input);
	console.log("add program to session", sessionId, programString);
	//#######################################


	if (g.doesExist(name) && g.doesExist(sessionId)) {

		var session = getSession(sessionId);

		if (session.session.programs && session.session.programs[name]) {
			
			console.log("program exists");
			return {
				program:session.session.programs[name],
				pdata:data(input.name),
				input:input
			}
		}


		console.log("program does not exist, make program");

		var result = setProgramForSession(sessionId, name, makeProgram(input));

		if (result) {

			session = getSession(sessionId);

			return {
				program:session.session.programs[name],
				pdata:data(input.name),
				input:input
			}
		}
		else {
			console.log("error: evolve session does not exist")
			return {
				program:null,
				pdata:null,
				input:input
			}
		}
	}
	else {

		console.log("error: missing either name or session")
		return {
			program:null,
			pdata:null,
			input:input
		}
	}
}



var getSessionProgram = function ($sessionId, name, input) {

	var session = getSession($sessionId);


	console.log("get program for session", $sessionId);

	if (session && session.id && ($sessionId == input.session)) {
	//session exists

		console.log("session exists, ids match");

		if (session.session.programs && session.session.programs[name]) {
		//programs exists with name

			console.log("program exists");
			return {
				program:session.session.programs[name],
				id:session.id,
				input:input
			}
		}
		else {


			console.log("program does not exist, add program");

			//make new program and add to session
			var program = addProgramToSession(input);

			session = getSession($sessionId);

			return {
				program:session.session.programs[name],
				id:session.id,
				input:input
			}

		}
		
		
	}
	else {

		console.log("session does not exist, create new session");

		//make new session and program
		session = createSessionEvolve();
		input.session = session.id;
		addProgramToSession(input);

		input.session = session.id;

		session = getSessionEvolve(session.id);

		var program = getSessionProgram(session.id, name, input);

		return {
			program:program.program,
			id:session.id,
			input:input
		}
	}

	
}

var sessionHardStop = function (session) {


	var session = getSessionEvolve(session);

	session.evolve.hardStop();
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