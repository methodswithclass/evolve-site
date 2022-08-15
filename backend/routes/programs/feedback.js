var feedbackExpress = require('express');
var feedbackRouter = recognizeExpress.Router();
var space = require('../../evolve-app/data/get/get.js');

feedbackRouter.post('/animate', function (req, res, next) {
  var input = req.body.input;
  var session = space.get(input.session);
  var program = session.getProgram(input);
  program.animate(input.plot, input.direction, input.duration);
});

module.exports = feedbackRouter;
