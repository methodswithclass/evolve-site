var recognizeExpress = require('express');
var recognizeRouter = recognizeExpress.Router();
var space = require('../../evolve-app/data/get/get.js');
var imageReader = require('../../evolve-app/programs/recognize/image-reader.js');

recognizeRouter.post('/simulate', function (req, res, next) {
  try {
    console.log('run best');

    var input = req.body.input;
    var session = space.get(input.session);
    var recognize = session.getProgram(input);
    recognize.simulate(req.body.index, function (output) {
      res.status(200).json({ output: output });
    });
  } catch (err) {
    next(err);
  }
});

recognizeRouter.post('/digit', function (req, res, next) {
  try {
    console.log('get digit');
    var input = req.body.input;
    var session = space.get(input.session);
    session.getProgram(input);
    var data = input.pdata;

    var image;

    imageReader.readfile(data.data.dataFile, function ($data) {
      image = $data.find(function (p) {
        return p.index == req.body.index;
      });

      res
        .status(200)
        .json({ image: image.pixels, index: image.index, label: image.label });
    });

    // recognize.simulate(function (image, output, label) {

    // 	res.json({image:image, output:output, label:label});
    // });
  } catch (err) {
    next(err);
  }
});

module.exports = recognizeRouter;
