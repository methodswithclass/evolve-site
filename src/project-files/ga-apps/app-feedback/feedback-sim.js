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

    react.subscribe({
        name:"importplot",
        callback:function (x) {

            changeplot = x.changeplot;
            changeX = x.changeX;
            createplot = x.createplot;
            resetplot = x.resetplot;

        }
    })

    var create = function () {

        console.log("create plot");

        // events.dispatch("createPlot");

        createplot();
    }

    var reset = function () {

        console.log("reset plot");

        // events.dispatch("resetPlot");

        resetplot();
    }

    var refresh = function () {

        changeX(200);

        reset();
    }

    var step = function (dna, duration) {

        // console.log("step simulator", dna);

        changeplot(dna, duration);

    }

    return {
        create:create,
        reset:reset,
        refresh:refresh,
    	step:step
    }


}]);