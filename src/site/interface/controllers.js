app.controller("main.controller", ['$scope', 'states', 'doc.data', 'global.service', 'page', function ($scope, states, dd, g, page) {

	var self = this;

	var sobj = states.split();

	console.log("open " + sobj.program);

	self.overview = dd.get("overview");

	self.doc = dd.get(sobj.program);

	self.open = function (state) {

		states.go(state);
	}

	$scope.page = page;

	$scope.getContentUrl = function() {
    
        var view;

        if (g.isMobile()) {

            view = "assets/views/mobile/site/" + $scope.page + ".html";
        }
	    else {
	        view = "assets/views/desktop/site/" + $scope.page + ".html";
	    }

        return view;
    }

}]);