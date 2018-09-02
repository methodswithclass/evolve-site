app.factory("trash-sim", ['$http', 'utility', 'api.service', 'input.service', function ($http, u, api, $input) {


    var shared = window.shared;
    var g = shared.utility_service;
    var events = shared.events_service;
    var react = shared.react_service;
    var send = shared.send_service;



    var i = 1;
    // var currentStep = 1;
    var _score = 0;
    var evdata = {};
    var genome;
    var active = false;
    var running = false;

    var pieces;
    var block;
    var man;

    var stepper;
    var colors = true;

    var name = "trash";
    
    var totalActions;


    var cleanBlock = function (x, y) {

        console.log("no clean block");
    }

    var makeBlocks = function () {

        console.log("no make blocks");
    }


    react.subscribe({
        name:"programInput" + name,
        callback:function(x) {

            // console.log("assign totalActions from programInput in simulator");

            totalActions = x.totalSteps;
        }
    })
    

    react.subscribe({
        name:"robot",
        callback:function (x) {

            // console.log("assign man object");

            man = x;
        }
    })

    react.subscribe({
        name:"ev.trash",
        callback:function (x) {
            // console.log("set evdata trash", x);
            evdata = x;
        }

    });


    react.subscribe({
        name:"block.functions",
        callback:function (x) {

            // console.log("assign clean block function");

            cleanBlock = x.cleanBlock;
            makeBlocks = x.makeBlocks;
        }
    })


    var output = function (_sout) {

        // console.log("output");

        react.push({
            name:"sim." + name,
            state:_sout
        });
    }


    var pre = 100;
    var de = 200;
    var du = 100;
    var post = 300;
    var feed = 300;
    var loop = 600;

    var fast = false;

    var slowfactor = 3;

    if (!fast) {
        pre *= slowfactor;
        de *= slowfactor;
        du *= slowfactor;
        post *= slowfactor;
        feed *= slowfactor;
        loop *= slowfactor;
    }

    var anime = {
        pre:pre,
        de:pre + de,
        du:du,
        predu:pre + du,
        post:pre + de + du + post,
        feed:pre + de + du + post + feed,
        loop:pre + de + du + post + feed + loop,
        full:pre + de + du + post + feed + loop + 300,
        part:de + du
    }

    var animate = function ($i, after, points) {


        var clean = function () {

            if (after.action.name == "clean" && after.success == "success") {

                cleanBlock(after.move.post.x, after.move.post.y);
            }
        }


        var assessMove = function () {

            _score += points;

            output({
                score:{
                    result:after.success,
                    change:after.success == "success" ? after.action.points.success : after.action.points.fail,
                    total:_score,
                },
                move:{
                    num:$i,
                    state:after.state,
                    action:after.action,
                    total:totalActions
                }
            });

        }

        man.outer.animate({
            left:after.move.post.x*man.width, 
            top:after.move.post.y*man.height
        }, anime.du, function () {
            
            assessMove();

            clean();

            // console.log("move", i, "action", after.action.name, "pos:", after.move.post, ":", after.success);
        });

    }

    var performStep = function (_input) {

        //console.log("simulate " + i);


        if (_input.step) u.toggle("hide", "step");

        if (active && _input.i <= totalActions) {


            api.simulate.trash({name:name, i:_input.i, session:_input.session}, function (res) {

                // console.log("run simulation", res.data);

                var result = res.data.result;

                animate(_input.i, result.after, result.points);

                if (!_input.step) {

                    i = _input.i;

                    setTimeout(function () {

                        performStep({i:_input.i + 1, step:false, session:_input.session});
                    }, anime.de);
                   
                }
                else {
                    u.toggle("show", "step", {delay:anime.predu});
                }

            })
            

        }
        else {
            stop();
        }
    }


    var setup = function (clear, complete) {

        // console.log("sim setup: instruct", evdata, i);


        totalActions = $input.getInput().programInput.totalSteps;
        

        if (!clear) {
            
            api.instruct(clear, function (res) {

                // console.log("post instruct", i);

                if (typeof complete === "function") complete();
            });
        }
    }


    var setStageSize = function () {

        $stage = $("#arena");

        ed = u.correctForAspect({
            id:"arena",
            factor:g.isMobile() ? 0.6 : 0.25, 
            aspect:1, 
            width:$(window).width(), 
            height:$(window).height()
        })

        $($stage).css({width:ed.width, height:ed.height});
        
    }


    var resetenv = function () {

        $stage = $("#arena");

        g.waitForElem({elems:$stage}, function (options) {

            api.resetEnvironment(function (res) {

                environment = res.data.env;

                makeBlocks(environment);

                // console.log("Reset environment success", res);
            });

        });


        if (man) man.outer.css({left:0, top:0});
    }

    var refreshenv = function (complete) {

        $stage = $("#arena");

        g.waitForElem({elems:$stage}, function (options) {


            setStageSize();

            api.refreshEnvironment(function (res) {


                // console.log("Refresh environment", res.data.env);

                environment = res.data.env;

                makeBlocks(environment);

                if (typeof complete == "function") complete();

            })

            $(window).resize(function () {

                setStageSize();
            })


        })
    }

    var reset = function () {

        i = 1;
        _score = 0;

        // console.log("\n\n\n\nreset sim", i);

        output({
            score:{
                result:"success",
                change:0,
                total:0,
            },
            move:{
                num:0,
                action:{
                    name:"wait"
                },
                total:totalActions
            }
        });

        // console.log("check");

        resetenv();

        // events.dispatch("resetenv");

    }

    var refresh = function (complete) {

        // events.dispatch("refreshenv");

        refreshenv(complete);

        reset();
    }

    var start = function (session) {

        // console.log("start", i);

        active = true;
        running = true;

        events.dispatch("sim." + name + ".start");

        performStep({i:i, step:false, session:session});
    }

    var step = function (session) {

        active = true;

        if (!running) performStep({i:i++, step:true, session:session});

    }

    var play = function (session, _colors) {

        // console.log("play", i);

        colors = _colors;

        clearInterval(stepper);
        stepper = {};
        stepper = null;

        setup(false, function () {

            start(session);

            u.toggle("disable", "refresh", {fade:300, delay:500});
            u.toggle("disable", "restart", {fade:300, delay:400});
            u.toggle("disable", "step", {fade:300, delay:300});
            u.toggle("disable", "play", {fade:300, delay:200});
            u.toggle("enable", "stop", {fade:300});

            // u.toggle("disable", "run", {fade:300, delay:100});
            u.toggle("hide", "settings", {fade:300});
        })

        
    }

    var stop = function () {

        // console.log("stop", i);

        active = false;
        running = false;

        complete();
    }

    var complete = function () {

        // events.dispatch("completeSim");


        u.toggle("enable", "refresh", {fade:300, delay:100});
        u.toggle("enable", "restart", {fade:300, delay:200});
        u.toggle("enable", "step", {fade:300, delay:300});
        u.toggle("enable", "play", {fade:300, delay:400});
        u.toggle("disable", "stop", {fade:300});

        u.toggle("enable", "run", {fade:300, delay:500});
        u.toggle("show", "settings", {fade:300});

        events.dispatch("sim."+name+".end");
    }


    return {
        setup:setup,
        resetenv:resetenv,
        reset:reset,
        refreshenv:refreshenv,
        refresh:refresh,
    	step:step,
    	play:play,
    	stop:stop
    }


}]);