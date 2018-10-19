



describe('app config', function() {
	
	var app;
	var config;
	var runtime;

	beforeEach(angular.mock.module("stateModule"));
	// beforeEach(angular.mock.module('app', ["stateModule"]));
	// Before each test set our injected Users factory (_Users_) to our local Users variable
	beforeEach(inject(function($injector) {
		runtime = $injector.get("runtime.state");
		// config = _config_;
		// runtime = _runtime_;
	}));


	// A simple test to verify the Users factory exists
	it('should exist', function() {
		expect(runtime).toBeDefined();
	});

});