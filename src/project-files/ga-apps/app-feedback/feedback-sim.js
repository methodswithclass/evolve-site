app.factory("feedback-sim", ['data', 'send.service', 'events.service', 'react.service', function (data, send, events, react) {

    var pdata = data.get("feedback");

    // var program = programs.get("feedback");

    var changeplot = function () {

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

        reset();
    }

    var step = function (dna, duration) {

        // console.log("step simulator");

        changeplot(dna, duration);

    }

    return {
        create:create,
        reset:reset,
        refresh:refresh,
    	step:step
    }


}]);