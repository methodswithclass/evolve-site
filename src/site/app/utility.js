

app.factory("utility", function () {

	var toggle = function (toggle, id, options) {

        if (!options) {
            options = {};
        }

        var $toggle = $("#"+id+"toggle");

        var hide = function () {

            $toggle.stop().animate({opacity:0}, options.fade ? options.fade : 0, function () {
                 $toggle.hide();
                 if (options.complete) options.complete();
            });
        }

        var show = function () {

            // $toggle.css({opacity:0});
            $toggle.show();
            $toggle.stop().animate({opacity:1}, options.fade ? options.fade : 0, function () {
                if (options.complete) options.complete();
            });
        }

        var disable = function () {

            $toggle.prop("disabled", true);
        }

        var enable = function () {

            $toggle.prop("disabled", false);
        }

        if (toggle == "show") {
            setTimeout(function () { if ($toggle[0]) show() }, options.delay ? options.delay : 0);
        }
        else if (toggle == "hide") {
            setTimeout(function () { if ($toggle[0]) hide() }, options.delay ? options.delay : 0);
        }
        else if (toggle == "disable") {
            if ($toggle[0]) disable();
        }
        else if (toggle == "enable") {
            if ($toggle[0]) enable();
        }
    }

    var dim = function (aspect) {

        var winW = $(window).width();
        var winH = $(window).height();

        var effH = winH*0.9 - 20 - 20 - 200 - 30;
        var effW = winW*0.9 - 20 - 100;

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