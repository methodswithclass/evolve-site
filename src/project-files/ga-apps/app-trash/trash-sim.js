app.factory("trash-sim", ['$http', 'utility', 'api.service', 'input.service', function ($http, u, api, $input) {


    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;


    var i = 1;
    var _score = 0;
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


    }


    react.subscribe({
        name:"robot",
        callback:function (x) {
            man = x;
        }
    })


    react.subscribe({
        name:"block.clean",
        callback:function (x) {

            cleanBlock = x;
        }
    })


    var output = function (_sout) {

        react.push({
            name:"sim.trash",
            state:_sout
        });
    }


    var pre = 100;
    var de = 300;
    var du = 100;
    var post = 300;
    var feed = 300;
    var loop = 600;

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

    var animate = function (i, after, points) {


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
                    num:i,
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
        });

    }

    var performStep = function (_input) {

        if (_input.step) u.toggle("hide", "step");

        if (active && _input.i <= totalActions) {


            api.simulate.trash({name:name, i:_input.i, session:_input.session}, function (res) {

                var result = res.data.result;

                animate(result.i, result.after, result.points);

                if (!_input.step) {

                    setTimeout(function () {

                        performStep({i:_input.i + 1, step:false, session:_input.session});
                    }, anime.predu);
                   
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


    var setup = function (complete) {

        console.log("sim setup");

        totalActions = $input.getInput().programInput.totalSteps;
        
        api.instruct(function (res) {

            if (typeof complete === "function") complete();
        });
    }

    var reset = function () {

        i = 1;
        _score = 0;

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

        events.dispatch("resetenv");

        api.resetEnvironment(function (res) {

            console.log("Reset environment success", res);
        });

        g.waitForElem({elems:man}, () => {

            man.outer.css({left:0, top:0});

        });

    }

    var refresh = function () {

        events.dispatch("refreshenv");
        reset();
    }

    var start = function (session) {

        active = true;
        running = true;

        performStep({i:1, step:false, session:session});
    }

    var step = function (session) {

        active = true;

        if (!running) performStep({i:i++, step:true, session:session});

    }

    var play = function (session, _colors) {

        console.log("play");

        colors = _colors;

        clearInterval(stepper);
        stepper = {};
        stepper = null;

        setup(function () {

            start(session);

            u.toggle("disable", "refresh", {fade:300, delay:500});
            u.toggle("disbale", "restart", {fade:300, delay:400});
            u.toggle("disable", "step", {fade:300, delay:300});
            u.toggle("disable", "play", {fade:300, delay:200});
            u.toggle("enable", "stop", {fade:300});

            u.toggle("disable", "run", {fade:300, delay:100});
            u.toggle("disable", "settings", {fade:300});
        })

        
    }

    var stop = function () {

        active = false;
        running = false;

        complete();
    }

    var complete = function () {

        u.toggle("enable", "refresh", {fade:300, delay:100});
        u.toggle("enable", "restart", {fade:300, delay:200});
        u.toggle("enable", "step", {fade:300, delay:300});
        u.toggle("enable", "play", {fade:300, delay:400});
        u.toggle("disable", "stop", {fade:300});

        u.toggle("enable", "run", {fade:300, delay:500});
        u.toggle("enable", "settings", {fade:300});
    }


    return {
        setup:setup,
        reset:reset,
        refresh:refresh,
    	step:step,
    	play:play,
    	stop:stop
    }


}]);