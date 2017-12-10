

var writeExpress = require("express");

var db = require("./db.js");

var Image = require("../evolve-app/data/models/Image.js");


var writeRouter = writeExpress.Router();


writeRouter.post("/image", function (req, res, next) {

	console.log("write image", req.body.index, req.body.label);

	var image = new Image({
		index:req.body.index,
		label:req.body.label,
		pixels:req.body.pixels
	})

	Image.findOne({"index":req.body.index}, "index", function (err, img) {

		if (err) { 
			console.log("Database error", err);
			res.json({err:err});
		}
		else {
			
			if (img) {

				res.json({index:img.index, label:img.label, saved:"failed: duplicate"});
			}
			else {

				image.save(function (err) {

					if (err) {

						console.log("Post /image failed, database error:", err);
						res.json({err:err});
					}
					else {

						res.json({index:image.index, label:image.label, saved:"success"});
					}
				})

			}

		}

	})

});


writeRouter.put("/clear", function (req, res, next) {

	console.log("clear all images");

	Image.remove({}, function (err) {

		if (err) {

			console.log("Put /clear", err);
			res.json({err:err, cleared:"failed"});
		}
		else {

			res.json({cleared:"success"});
		}
	})

})



module.exports = writeRouter;



