app.factory("feedback-sim", ['data', 'send.service', 'events.service', 'react.service', function (data, send, events, react) {

    var pdata = data.get("feedback");

    // var program = programs.get("feedback");

    var changeplot = function () {

        console.log("no change to plot");

    }

    react.subscribe({
        name:"importplot",
        callback:function (x) {

            changeplot = x;

        }
    })

    var create = function () {

        console.log("create plot");

        events.dispatch("createPlot");
    }

    var reset = function () {

        console.log("reset plot");

        events.dispatch("resetPlot");
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