var trashExpress = require('express');
var trashRouter = trashExpress.Router();
var space = require('../../evolve-app/data/get/get.js');

trashRouter.post('/simulate', function (req, res, next) {
  try {
    console.log('simulate step', req.body);
    var input = req.body.input;
    var session = space.get(input.session);
    var trash = session.getProgram(input);
    var result = trash.simulate();
    res.json({ result: result });
  } catch (err) {
    next(err);
  }
});

trashRouter.post('/environment/refresh', function (req, res, next) {
  try {
    var input = req.body.input;
    var session = space.get(input.session);
    var trash = session.getProgram(input);
    var env = trash.refresh(input.programInput);
    res.json({ env: env });
  } catch (err) {
    next(err);
  }
});

trashRouter.post('/environment/reset', function (req, res, next) {
  try {
    var input = req.body.input;
    var session = space.get(input.session);
    var trash = session.getProgram(input);
    var env = trash.reset(0);
    res.json({ env: env });
  } catch (err) {
    next(err);
  }
});

module.exports = trashRouter;
