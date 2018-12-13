stateModule.provider("runtime.state", ["$stateProvider", function ($stateProvider) {
  // runtime dependencies for the service can be injected here, at the provider.$get() function



    var shared = window.shared;
    var g = shared.utility_service;
    var react = shared.react_service;
    var send = shared.send_service;
    var events = shared,events_service;


    var _forceMobile = false;
    var inter = "interface1";

    var provider = {};


    // react.subscribe({
    //     name:"interface",
    //     callback:function(x) {

    //         inter = x;
    //     }
    // })


    // var initInterface = function ($interface) {

    //     inter = $interface;

    // }

    var $$mobile = function (input) {

        _forceMobile = input;
    }


    var choiceDirectory = function (site) {

        return site ? "app" : "evolve-app"
    }

    var choiceInterfaceOrientation = function () {

        return "/views/" + inter + "/" + ((_forceMobile || g.isMobile()) ? "mobile" : "desktop");
    }


    var stateViewUrls = [
    {
        name:"unsupported",
        between:"",
        url:"/unsupported.html",
        site:true
    },
    {
        name:"home",
        between:"",
        url:"/home.html",
        site:true
    },
    {
        name:"feedback",
        between:"",
        url:"/page.html",
        site:true
    },
    {
        name:"feedback#demo",
        between:"/demos/app-feedback",
        url:"/feedback_demo.html",
        site:false
    },
    {
        name:"trash",
        between:"",
        url:"/page.html",
        site:true
    },
    {
        name:"trash#demo",
        between:"/demos/app-trash",
        url:"/trash_demo.html",
        site:false
    },
    {
        name:"recognize",
        between:"",
        url:"/page.html",
        site:true
    },
    {
        name:"recognize#demo",
        between:"/demos/app-recognize",
        url:"/recognize_demo.html",
        site:false
    }
    ]

    // console.log("runtime provider template html", templateHtml);

    var states = [
    {
        name:"unsupported",
        url:"/p/unsupported",
        controller:"main.controller",
        controllerAs:"main"
    },
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

        
        $state.templateUrl = "assets/views/" + choiceDirectory(stateUrl.site) + stateUrl.between + choiceInterfaceOrientation() + stateUrl.url;

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

    // provider.initInterface = initInterface;
    provider.addState = addState;
    provider.stateViewUrls = stateViewUrls;
    provider.states = states;
    provider.mobile = mobile;

    return provider;
}]);