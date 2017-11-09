app.factory("trash-sim", ['$http', 'utility', 'events.service', 'react.service', function ($http, u, events, react) {

    var i = 1;
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
    var d;
    var totalActions;



    var cleanBlock = function (x, y) {


    }

    var setData = function ($d) {

        d = $d;

        totalActions = d.data.actions ? d.data.actions.total : 1;
    }


    var getData = function () {

        $http({
            method:"GET",
            url:"/evolve/data/" + name
        })
        .then(function (res) {

            console.log("getting data", res.data);

            var $d = res.data.data;
            setData($d);

        }, function (err) {

            // console.log("Server error while getting datat", err);

        })

    }

    getData();

    react.subscribe({
        name:"robot",
        callback:function (x) {
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
        name:"block.clean",
        callback:function (x) {

            cleanBlock = x;
        }
    })


    var output = function (_sout) {

        // console.log("output");

        react.push({
            name:"sim.trash",
            state:_sout
        });
    }

    var resetEnvironmentBackend = function (session) {

        $http({
            method:"GET",
            url:"/trash/environment/reset/" + session
        })
        .then(function (res) {

            console.log(res.data.success);

        }, function (err) {

            console.log("Server error while initializing algorithm", err.message);

        })

    }

    var instruct = function (session, complete) {


        $http({
            method:"GET",
            url:"/evolve/instruct/trash/" + session
        })
        .then(function (res) {

            console.log(res.data.success);

            if (complete) complete();

        }, function (err) {

            console.log("Server error while initializing algorithm", err.message);

        })
    }


    var setup = function (session, complete) {

        console.log("sim setup instruct", evdata);

        // genome = evdata.best ? evdata.best.dna : [];
        instruct(session, complete);
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
                    name:after.action.name,
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

            console.log("move", i, "action", after.action.name, "pos:", after.move.post, ":", after.success);
        });

    }

    var performStep = function (input) {

        //console.log("simulate " + i);


        u.toggle("hide", "step");

        if (active && input.i <= totalActions) {

            $http({
                method:"POST",
                url:"/trash/simulate",
                data:{name:name, i:input.i, session:input.session}
            })
            .then(function (res) {

                console.log("run simulation", res.data);

                var result = res.data.result;

                animate(result.i, result.after, result.points);

                if (!input.step) {

                    setTimeout(function () {

                        performStep({i:input.i + 1, step:false, session:input.session});
                    }, anime.predu);
                   
                }
                else {
                    u.toggle("show", "step", {delay:colors ? anime.full : anime.part});
                }

            }, function (err) {

                console.log("Server error while setting input", err.message);

            })

        }
        else {
            stop();
        }
    }

    var reset = function (session) {

        i = 1;
        _score = 0;

        console.log("reset sim");

        output({
            score:{
                result:"success",
                change:0,
                total:0,
            },
            move:{
                num:0,
                name:"wait",
                total:totalActions
            }
        });

        // setup();

        events.dispatch("resetenv");

        resetEnvironmentBackend(session);
        man.outer.css({left:0, top:0});

    }

    var refresh = function (session) {

        events.dispatch("refreshenv");
        reset(session);
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

        console.log("play", evdata.index);

        colors = _colors;

        clearInterval(stepper);
        stepper = {};
        stepper = null;

        setup(session, function () {

            start(session);

            u.toggle("show", "stop", {fade:300});
            u.toggle("hide", "refresh", {fade:300});
            u.toggle("hide", "restart", {fade:300});
            u.toggle("hide", "step", {fade:300});
            u.toggle("hide", "play", {fade:300});
            u.toggle("hide", "run", {fade:300});
            u.toggle("hide", "settings", {fade:300});
        })

        
    }

    var stop = function () {

        active = false;
        running = false;

        complete();
    }

    var complete = function () {

        events.dispatch("completeSim");


        u.toggle("hide", "stop", {fade:300});
        u.toggle("show", "refresh", {fade:300});
        u.toggle("show", "restart", {fade:300});
        u.toggle("show", "play", {fade:300});
        u.toggle("show", "step", {fade:300});
        u.toggle("show", "run", {fade:300});
        u.toggle("show", "settings", {fade:300});
    }

    // var print = function () {

    //     environment.print();
    // }

    return {
        setup:setup,
        reset:reset,
        refresh:refresh,
    	step:step,
    	play:play,
    	stop:stop
        // print:print
    }


}]);