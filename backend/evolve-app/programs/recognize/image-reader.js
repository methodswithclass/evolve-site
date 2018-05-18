
var fs = require("fs");



var processCSVAll = function (result) {

	var dataAll = result.split(/(\r\n|\r|\n)/g).slice(2);

	// console.log("dataAll", dataAll);

	var data = [];

	for (var j in dataAll) {

		if (j % 2 == 0) {
			data.push(dataAll[j])
		}
	}

	data = data.slice(0, data.length-1);

	var sample;
	var items = [];
	var label;
	var pixels = [];
	var output = [];

	for (var i in data) {

		items = [];
		pixels = [];

		sample = data[i];
		items = sample.split(",");

		label = items.slice(0,1);
		pixels = items.slice(1);

		output.push({
			index:i,
			pixels:pixels,
			label:label[0]
		})

	}

	return output;

}



var readfile = function (filename, callback) {

	var data = [];

	fs.readFile(filename, 'utf-8', function (err, content) {

		if (err) {

			console.log("Error reading file", err);
		}
		else {

			data = processCSVAll(content);

			callback(data);
		}

	})

}



module.exports = {
	readfile:readfile
}




