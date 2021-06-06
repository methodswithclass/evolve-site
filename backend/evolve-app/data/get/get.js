var evolveFact = require('@methodswithclass/evolve');
// var evolveFact = require("../../@.ga/__.ga.js");
var g = require('@methodswithclass/shared').utility_service;
// var g = require("../../../../src/assets/js/shared.js").utility_service;
const UIDGenerator = require('uid-generator');

const uidgen = new UIDGenerator();

var SESSION_EXPIRY = 3600 * 24 * 1000;

var evolve = {};

var getSessionId = function () {
  return uidgen.generateSync();
};

var getData = function (name) {
  // console.log("get data", name, __dirname);

  return require('../programs/' + name + '.js');
};

var makeProgramString = function ($options) {
  var program = $options.name ? $options.name : undefined;
  var options = $options.programInput ? $options.programInput : undefined;

  var programExists = g.doesExist(program);
  var optionsExists = g.doesExist(options.processType);

  // console.log("process type", optionsExists, "\n\n\n");

  var programString;
  var typeString = '';

  if (programExists) {
    programString = program + '/' + program;
  }

  if (optionsExists) {
    typeString += '-types/' + program + '_' + options.processType + '.js';
  }

  programString += program == 'trash' ? typeString : '';

  // console.log("programstring", programString);

  return programString;
};

var clearSessions = function () {
  var now = new Date().getTime();

  for (var i in evolve) {
    if (!evolve[i].expires || now > evolve[i].expires) {
      delete evolve[i];
    }
  }
};

var programs = function (input) {
  var programString = makeProgramString(input);

  return require('../../programs/' + programString);
};

var makeProgram = function (options) {
  // var module = options.name;
  // var progArray = program.split("/");
  // module = progArray.length > 1 ? progArray[1] : program;

  var prog = programs(options);

  return new prog(options.programInput);
};

var makeEvolve = function () {
  return new evolveFact.module();
};

var createSessionEvolve = function () {
  clearSessions();

  var sessionId = getSessionId();

  console.log('create session', sessionId);

  var now = new Date();
  var nowMilli = now.getTime();
  var expires = new Date(nowMilli + SESSION_EXPIRY);

  evolve[sessionId] = {};
  evolve[sessionId].evolve = makeEvolve();
  evolve[sessionId].expires = expires.getTime();

  return {
    session: evolve[sessionId],
    id: sessionId,
  };
};

var setProgramForSession = function (sessionID, name, program) {
  if (evolve[sessionID]) {
    if (!evolve[sessionID].programs) {
      evolve[sessionID].programs = {};
    }

    evolve[sessionID].programs[name] = program;

    return true;
  } else {
    return false;
  }
};

var getSession = function (sessionId) {
  return {
    session: evolve[sessionId],
    id: sessionId,
  };
};

var getAllSessions = function () {
  return evolve;
};

var getSessionEvolve = function ($sessionId) {
  var session = getSession($sessionId);

  if (!(session && session.session && session.session.evolve)) {
    console.log(
      'session with id:',
      $sessionId,
      'does not exist, creating new session'
    );

    session = createSessionEvolve();
  }

  return {
    evolve: session.session.evolve,
    id: session.id,
  };
};

var addProgramToInput = function (input, program, pdata) {
  // console.log("add program input", input);

  // var result = get.addProgramToSession(input);

  input.program = program;
  input.pdata = pdata;

  return {
    program: program,
    pdata: pdata,
    input: input,
  };
};

var addProgramToSession = function (input) {
  var name = input.name ? input.name : undefined;
  var sessionId = input.session ? input.session : undefined;

  //just for logging actual string retrieved in programs() func
  var programString = makeProgramString(input);
  // console.log("add program to session", sessionId, programString);
  //#######################################

  var session;
  var result;

  var data = getData(input.name);

  if (g.doesExist(name) && g.doesExist(sessionId)) {
    session = getSession(sessionId);

    if (session.session.programs && session.session.programs[name]) {
      result = addProgramToInput(input, session.session.programs[name], data);

      // console.log("program exists");
      return {
        program: result.program,
        pdata: result.pdata,
        input: result.input,
      };
    }

    // console.log("program does not exist, make program");

    result = addProgramToInput(input, makeProgram(input), data);

    var sessionExists = setProgramForSession(sessionId, name, result.program);

    if (sessionExists) {
      return {
        program: result.program,
        pdata: result.pdata,
        input: result.input,
      };
    } else {
      console.log('error: evolve session does not exist');
      return {
        program: null,
        pdata: null,
        input: input,
      };
    }
  } else {
    console.log('error: missing either name or session');
    return {
      program: null,
      pdata: null,
      input: input,
    };
  }
};

var getSessionProgram = function ($sessionId, name, input) {
  var session = getSession($sessionId);

  // console.log("get program for session", $sessionId);

  var result;
  var program;

  var data = getData(input.name);

  if (session && session.id && $sessionId == input.session) {
    //session exists

    // console.log("session exists, ids match");

    if (session.session.programs && session.session.programs[name]) {
      //programs exists with name

      // console.log("program exists");

      result = addProgramToInput(input, session.session.programs[name], data);

      return {
        program: result.program,
        pdata: result.pdata,
        id: session.id,
        input: result.input,
      };
    } else {
      // console.log("program does not exist, add program");

      //make new program and add to session
      program = addProgramToSession(input);

      // session = getSession($sessionId);

      return {
        program: program.program,
        pdata: program.pdata,
        id: session.id,
        input: program.input,
      };
    }
  } else {
    // console.log("session does not exist, create new session");

    //make new session and program
    session = createSessionEvolve();
    input.session = session.id;
    addProgramToSession(input);

    input.session = session.id;

    var sessionEvolve = getSessionEvolve(session.id);

    program = getSessionProgram(sessionEvolve.id, name, input);

    return {
      program: program.program,
      pdata: program.pdata,
      id: session.id,
      input: program.input,
    };
  }
};

var sessionHardStop = function (sessionId) {
  var session = getSessionEvolve(sessionId);

  session.evolve.hardStop();
};

module.exports = {
  getData: getData,
  getSessionId: getSessionId,
  programs: programs,
  createSessionEvolve: createSessionEvolve,
  addProgramToSession: addProgramToSession,
  getAllSessions: getAllSessions,
  getSession: getSession,
  getSessionEvolve: getSessionEvolve,
  getSessionProgram: getSessionProgram,
  sessionHardStop: sessionHardStop,
};
