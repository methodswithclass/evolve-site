



var data = function (name) {

	console.log("get data", __dirname);

	return require("../programs/" + name + ".js");
}



var programs = function (name) {

	return require("../../programs/" + name + "/" + name + ".js")
}



module.exports =  {
	data:data,
	programs:programs
}