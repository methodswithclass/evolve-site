

// var mongoose = require("mongoose");


// var ENV = {
// 	dev:"development",
// 	prod:"production"
// }

// var environment = "development";
// // var environment = "production";



// // var produrlstring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/HelloMongoose';
// var produrlstring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
// var devurlstring = "mongodb://cpolito03:password3#@cluster0-shard-00-00-hleii.mongodb.net:27017,cluster0-shard-00-01-hleii.mongodb.net:27017,cluster0-shard-00-02-hleii.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"


// var urlstring = environment == ENV.dev ? devurlstring : produrlstring


// mongoose.connect(urlstring, {useMongoClient: true}, function (err, res) {
// 	if (err) {
// 		console.log ('ERROR connecting to: ' + urlstring + '. ' + err);
// 	} else {
// 		console.log ('Succeeded connected to: ' + urlstring);
// 	}
// });


// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));




module.exports = {};
