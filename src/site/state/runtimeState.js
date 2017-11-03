stateModule.provider("runtime.state", function ($stateProvider) {
  // runtime dependencies for the service can be injected here, at the provider.$get() function.

    var provider = {};

    var states = [
    {
        name:"home",
        url:"/home",
        templateUrl:"assets/views/site/home.html",
        controller:'main.controller',
        controllerAs:"main"
    },
    {
        name:"overview",
        url:"/p/overview",
        templateUrl:"assets/views/site/page.html",
        controller:"main.controller",
        controllerAs:"main"

    },
    {
        name:"feedback",
        url:"/p/feedback",
        templateUrl:"assets/views/site/page.html",
        controller:"main.controller",
        controllerAs:"main"

    },
    {
        name:"feedback#demo",
        url:"/p/feedback/demo",
        templateUrl:"assets/views/ga-apps/feedback/feedback_demo.html",
        controller:'feedback.controller',
        controllerAs:"main"
    },
    {
        name:"trash",
        url:"/p/trash",
        templateUrl:"assets/views/site/page.html",
        controller:'main.controller',
        controllerAs:"main"
    },
    {
        name:"trash#demo",
        url:"/p/trash/demo",
        templateUrl:"assets/views/ga-apps/trash/trash_demo.html",
        controller:'trash.controller',
        controllerAs:"main"
    },
    {
        name:"recognize",
        url:"/p/recognize",
        templateUrl:"assets/views/site/page.html",
        controller:'main.controller',
        controllerAs:"main"
    },
    {
        name:"recognize#demo",
        url:"/p/recognize/demo",
        templateUrl:"assets/views/ga-apps/recognize/recognize_demo.html",
        controller:'recognize.controller',
        controllerAs:"main"
    }
    ];

    var addState = function(state) { 

        console.log("add state " + state.name);

        $stateProvider.state(state);
    }

    provider.$get = function () {

        var service = function () {


        }

        return new service();
    
    };

    provider.addState = addState;
    provider.states = states;

    return provider;
});