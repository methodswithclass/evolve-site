var evolveExpress = require('express');
var evolveRouter = evolveExpress.Router();
var space = require('../evolve-app/data/get/get.js');

evolveRouter.get('/instantiate', function (req, res, next) {
  try {
    console.log('instantiate');
    var id = space.createSession();
    var session = space.get(id);
    res.status(200).json({ session: session.id, success: 'success' });
  } catch (err) {
    next(err);
  }
});

evolveRouter.post('/initialize', function (req, res, next) {
  try {
    console.log('initialize');
    var input = req.body.input;
    console.log('input', input);
    var session = space.get(input.session);
    session.addProgram(input);
    let success = session.evolve.initialize(input);
    res.status(200).json({ session: session.id, success: success });
  } catch (err) {
    next(err);
  }
});

evolveRouter.post('/set', function (req, res, next) {
  try {
    var input = req.body.input;
    console.log('input is, during set input\n', input, '\n');
    var session = space.get(req.body.input.session);
    session.evolve.set(req.body.input);
    res.status(200).json({ session: session.id, success: 'success' });
  } catch (err) {
    next(err);
  }
});

evolveRouter.post('/run', function (req, res, next) {
  try {
    console.log('run evolve', req.body.input);
    var session = space.get(req.body.input.session);
    let success = session.evolve.run(req.body.input);
    res.status(200).json({ success: success, running: true });
  } catch (err) {
    next(err);
  }
});

evolveRouter.post('/running', function (req, res, next) {
  try {
    var session = space.get(req.body.input.session);
    res.status(200).json({ running: session.evolve.running() });
  } catch (err) {
    next(err);
  }
});

evolveRouter.post('/best', function (req, res, next) {
  try {
    var session = space.get(req.body.input.session);
    res.status(200).json({ ext: session.evolve.getBest() });
  } catch (err) {
    next(err);
  }
});

evolveRouter.post('/instruct', function (req, res, next) {
  try {
    console.log('instruct');
    var clear = req.body.clear;
    var input = req.body.input;
    var session = space.get(input.session);
    var ext = session.evolve.getBest();
    console.log('best', ext);
    var program = session.getProgram(input);
    program.instruct(clear ? [] : ext.best.dna);
    res.status(200).json({ success: 'program successfully instructed' });
  } catch (err) {
    next(err);
  }
});

evolveRouter.post('/stepdata', function (req, res, next) {
  try {
    console.log('get stepdata');
    var input = req.body.input;
    var session = space.get(input.session);
    var program = session.getProgram(input);
    var stepdata = program.stepdata();
    res.status(200).json({ stepdata: stepdata });
  } catch (err) {
    next(err);
  }
});

evolveRouter.post('/hardStop', function (req, res, next) {
  try {
    console.log('hard stop');
    var session = space.get(req.body.input.session);
    session.hardStop(req.body.input);
    res.status(200).json({ success: 'success' });
  } catch (err) {
    next(err);
  }
});

module.exports = evolveRouter;
