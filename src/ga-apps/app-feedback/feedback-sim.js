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

        events.dispatch("createPlot");
    }

    var reset = function () {

        events.dispatch("resetPlot");
    }

    var step = function (dna, duration) {

        console.log("step simulator");

        changeplot(dna, duration);

    }

    return {
        create:create,
        reset:reset,
    	step:step
    }


}]);