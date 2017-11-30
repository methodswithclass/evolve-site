

app.factory("utility", function () {

	var toggle = function (toggle, id, options) {

        if (!options) {
            options = {};
        }

        var $toggle = $("#"+id+"toggle");
        var $cover = $("#"+id+"togglecover");

        // console.log("toggle", toggle, id);

        var hide = function () {

            $toggle.animate({opacity:0}, options ? (options.fade ? options.fade : 0) : 0, function () {
                 $toggle.css({display:"none"});
                 if (options.complete) options.complete();
            });
        }

        var show = function () {

            // $toggle.css({opacity:0});
            $toggle.css({display:"block"});
            $toggle.animate({opacity:1}, options ? (options.fade ? options.fade : 0) : 0, function () {
                if (options.complete) options.complete();
            });
        }

        var disable = function () {

            //$toggle.prop("disabled", true);
            $cover.css({display:"block"});
            $cover.animate({opacity:0.9}, options ? (options.fade ? options.fade : 0) : 0, function () {
                if (options.complete) options.complete();
            });
        }

        var enable = function () {

            //$toggle.prop("disabled", false);
            $cover.animate({opacity:0}, options ? (options.fade ? options.fade : 0) : 0, function () {
                $cover.css({display:"none"});
                if (options.complete) options.complete();
            });
        }

        if (toggle == "show") {
            setTimeout(function () { if ($toggle[0]) show() }, options ? (options.delay ? options.delay : 0) : 0);
        }
        else if (toggle == "hide") {
            setTimeout(function () { if ($toggle[0]) hide() }, options ? (options.delay ? options.delay : 0) : 0);
        }
        else if (toggle == "disable") {
            setTimeout(function () { if ($toggle[0]) disable(); }, options ? (options.delay ? options.delay : 0) : 0);
        }
        else if (toggle == "enable") {
            setTimeout(function () { if ($toggle[0]) enable(); }, options ? (options.delay ? options.delay : 0) : 0);
        }
    }

    var dim = function (aspect) {

        var winW = $(window).width();
        var winH = $(window).height();

        // var effH = winH*0.9 - 20 - 20 - 200 - 30;
        // var effW = winW*0.9 - 20 - 100;

        var effH = winH*0.8;
        var effW = winW*0.8;

        var height = effH;
        var width = effH*aspect;

        if (width > effW) {
            width = effW;
            height = effW/aspect;
        }

        return {
            width:width,
            height:height
        }
        
    }

	return {
		toggle:toggle,
        dim:dim
	}

})