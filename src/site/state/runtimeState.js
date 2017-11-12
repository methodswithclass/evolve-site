stateModule.provider("runtime.state", function ($stateProvider) {
  // runtime dependencies for the service can be injected here, at the provider.$get() function.

    var provider = {};

    var states = [
    {
        name:"home",
        url:"/home",
        template:"<div ng-include='getContentUrl()'></div>",
        resolve: {
            page: function () {
                return "home";
            }
        },
        controller:'main.controller',
        controllerAs:"main"
    },
    {
        name:"overview",
        url:"/p/overview",
        template:"<div ng-include='getContentUrl()'></div>",
        resolve: {
            page: function () {
                return "page";
            }
        },
        controller:"main.controller",
        controllerAs:"main"

    },
    {
        name:"feedback",
        url:"/p/feedback",
        template:"<div ng-include='getContentUrl()'></div>",
        resolve: {
            page: function () {
                return "page";
            }
        },
        controller:"main.controller",
        controllerAs:"main"

    },
    {
        name:"feedback#demo",
        url:"/p/feedback/demo",
        template:"<div ng-include='getContentUrl()'></div>",
        controller:'feedback.controller',
        controllerAs:"main"
    },
    {
        name:"trash",
        url:"/p/trash",
        template:"<div ng-include='getContentUrl()'></div>",
        resolve: {
            page: function () {
                return "page";
            }
        },
        controller:'main.controller',
        controllerAs:"main"
    },
    {
        name:"trash#demo",
        url:"/p/trash/demo",
        template:"<div ng-include='getContentUrl()'></div>",
        controller:'trash.controller',
        controllerAs:"main"
    },
    // {
    //     name:"recognize",
    //     url:"/p/recognize",
    //     templateUrl:"<div ng-include='getContentUrl()'></div>",
    //     resolve: {
    //         page: function () {
    //             return "page"
    //         }
    //     },
    //     controller:'main.controller',
    //     controllerAs:"main"
    // },
    // {
    //     name:"recognize#demo",
    //     url:"/p/recognize/demo",
    //     template:"<div ng-include='getContentUrl()'></div>",
    //     controller:'recognize.controller',
    //     controllerAs:"main"
    // }
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