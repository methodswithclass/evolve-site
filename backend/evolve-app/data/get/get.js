var g = require('@methodswithclass/shared').utility_service;
var evolveFact = require('@methodswithclass/evolve');
const uuid = require('uuid').v4;

var SESSION_EXPIRY = 3600 * 24 * 1000; // 1 day

var Program = function (props) {
  var self = this;

  var _input = props.input;

  var makeProgramString = function (input) {
    var program = input.name ? input.name : undefined;
    var programInput = input.programInput ? input.programInput : {};

    var programExists = g.doesExist(program);
    var optionsExists = g.doesExist(programInput.processType);

    var programString;
    var typeString = '';

    if (programExists) {
      programString = program + '/' + program;
    }
    if (optionsExists) {
      typeString +=
        '-types/' + program + '_' + programInput.processType + '.js';
    }
    programString += program == 'trash' ? typeString : '';

    return programString;
  };

  var programs = function (input) {
    var programString = makeProgramString(input);
    return require('../../programs/' + programString);
  };

  var makeProgram = function (input) {
    var prog = programs(input);
    return new prog(input.programInput);
  };

  var getData = function (name) {
    return require('../programs/' + name + '.js');
  };

  self.instance = makeProgram(_input);
  self.data = getData(_input.name);
};

var Session = function (props) {
  var self = this;

  var id = props.id;

  var makeEvolve = function () {
    return new evolveFact.module();
  };

  self.evolve = makeEvolve();
  self.expires = new Date().getTime() + SESSION_EXPIRY;
  self.id = id;
  self.programs = {};

  self.isExpired = function () {
    var now = new Date().getTime();
    return now > self.expires;
  };

  self.addProgram = function (input) {
    var program = new Program({ input });
    self.programs[input.name] = program;
    self.getProgram(input);
  };

  self.getProgram = function (input) {
    var program = self.programs[input.name];
    if (!program) {
      program = self.addProgram(input);
    }
    input.program = program.instance;
    input.pdata = program.data;
    return program.instance;
  };

  self.hardStop = function (input) {
    self.evolve.hardStop(input);
  };
};

var SessionSpace = function () {
  var self = this;

  var sessionMap = {};

  var getSessionId = function () {
    return uuid();
  };

  var clearAll = function () {
    for (var i in sessionMap) {
      if (sessionMap[i].isExpired()) {
        delete sessionMap[i];
      }
    }
  };

  self.get = function (id) {
    var session = sessionMap[id];

    if (session) {
      return session;
    }

    self.createSession(id);
    return sessionMap[id];
  };

  self.createSession = function (id) {
    clearAll();
    if (!id) {
      id = getSessionId();
    }
    var session = new Session({ id });
    sessionMap[id] = session;
    return id;
  };
};

module.exports = new SessionSpace();
