app.factory("feedback-sim", ['data', function (data) {


    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;


    var pdata = data.get("feedback");

    // var program = programs.get("feedback");

    var changeplot = function () {

        console.log("no change to plot");

    }

    var changeX = function  () {

        console.log("no change to plot");
    }

    var createplot = function () {

        console.log("plot not created");
    }


    var resetplot = function () {

        console.log("plot not reset");
    }

    var stopPlot = function () {

        console.log("plot not reset");
    }

    var refreshUI = function (options) {

        console.log("refresh ui not set");
    }

    react.subscribe({
        name:"importplot",
        callback:function (x) {

            changeplot = x.changeplot;
            changeX = x.changeX;
            createplot = x.createplot;
            resetplot = x.resetplot;
            stopPlot = x.stopPlot;
            refreshUI = x.refreshUI;

        }
    })

    var create = function () {

        console.log("create plot");

        // events.dispatch("createPlot");

        createplot();
    }

    var setup = function (clear, complete) {

        refreshUI();

        if (typeof complete === "function") complete();
    }

    var stop = function () {

        console.log("stop plot");

        stopPlot();
    }

    var reset = function () {

        console.log("reset plot");

        // events.dispatch("resetPlot");

        // stop();

        resetplot();
    }

    var refresh = function (complete) {

        // changeX(200);

        reset();

        if (typeof complete === "function") complete();
    }

    var updateUI = function () {

        g.waitForElem({elems:["#innerplot", "#arena"]}, function (options) {
            refreshUI(options);
        });
    }

    var step = function (dna, duration) {

        // console.log("step simulator", duration);

        changeplot(dna, duration);

    }

    return {
        create:create,
        setup:setup,
        reset:reset,
        refresh:refresh,
    	step:step,
        stop:stop,
        updateUI:updateUI
    }


}]);