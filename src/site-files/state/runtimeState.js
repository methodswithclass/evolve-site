stateModule.provider("runtime.state", function ($stateProvider) {
  // runtime dependencies for the service can be injected here, at the provider.$get() function.

    var g = shared.utility_service;

    var _forceMobile = false;
    var inter;

    var provider = {};

    var initInterface = function ($interface) {

        inter = $interface;

    }

    var mobile = function (input) {

        _forceMobile = input;
    }

    var baseViewUrl = function (responsive) {

        return "assets/views/" + inter + "/" + (responsive ? ((_forceMobile || checkMobile()) ? "mobile" : "desktop") : "common");
    }


    var stateViewUrls = [
    {
        name:"home",
        url:"/site/home.html",
        responsive:true
    },
    {
        name:"feedback",
        url:"/site/page.html",
        responsive:true
    },
    {
        name:"feedback#demo",
        url:"/ga-apps/feedback/feedback_demo.html",
        responsive:true
    },
    {
        name:"trash",
        url:"/site/page.html",
        responsive:true
    },
    {
        name:"trash#demo",
        url:"/ga-apps/trash/trash_demo.html",
        responsive:true
    },
    {
        name:"recognize",
        url:"/site/page.html",
        responsive:true
    },
    {
        name:"recognize#demo",
        url:"/ga-apps/recognize/recognize_demo.html",
        responsive:true
    }
    ]

    // console.log("runtime provider template html", templateHtml);

    var states = [
    {
        name:"home",
        url:"/home",
        controller:'main.controller',
        controllerAs:"main"
    },
    {
        name:"feedback",
        url:"/p/feedback",
        controller:"main.controller",
        controllerAs:"main"

    },
    {
        name:"feedback#demo",
        url:"/p/feedback/demo",
        controller:"app.controller",
        controllerAs:"main"
    },
    {
        name:"trash",
        url:"/p/trash",
        controller:'main.controller',
        controllerAs:"main"
    },
    {
        name:"trash#demo",
        url:"/p/trash/demo",
        controller:"app.controller",
        controllerAs:"main"
    },
    {
        name:"recognize",
        url:"/p/recognize",
        controller:'main.controller',
        controllerAs:"main"
    },
    {
        name:"recognize#demo",
        url:"/p/recognize/demo",
        controller:"app.controller",
        controllerAs:"main"
    }
    ];

    var addTemplateUrl = function (state) {


        var $state = states.find(function (p) {

            return p.name == state.name;
        });


        var stateUrl = stateViewUrls.find(function (p) {

            return p.name == state.name;
        })

        if ($state.name == "admin") {
            $state.templateUrl = "assets/views/" + stateUrl.url;
        }
        else {
            $state.templateUrl = baseViewUrl(stateUrl.responsive) + stateUrl.url;
        }

        return $state; 
    }

    var addState = function(state) { 

        console.log("add state " + state.name);

        state = addTemplateUrl(state);

        $stateProvider.state(state);
    }

    provider.$get = ['utility', function (u) {


        console.log("set service interface", inter);
        u.setInterface(inter);


        var service = function () {

            return {
                stateViewUrls:stateViewUrls,
                states:states
            }

        }

        return new service();
    
    }];

    provider.initInterface = initInterface;
    provider.addState = addState;
    provider.stateViewUrls = stateViewUrls;
    provider.states = states;
    provider.mobile = mobile;

    return provider;
});