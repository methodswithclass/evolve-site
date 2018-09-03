

const presets = [
	[
		"@babel/env", 
		{
			targets: {
			  edge: "15",
			  firefox: "44",
			  chrome: "55",
			  safari: "7",
			  ie:"9"
			},
			useBuiltIns: "usage"
		}
	]
]

module.exports = { presets };