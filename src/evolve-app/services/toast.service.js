app.factory("toast.service", ["$mdToast", function ($mdToast) {


    var isShown = false;


    var showing = function (_toggle) {

        if (_toggle != undefined) {
            isShown = _toggle;
        }

        return isShown;
    }


	var showToast = function (options) {

        var $message = options.message;
        var duration = options.duration;
        var delay = options.delay;


        // console.log("show toast", toast.show, "\n\n\n\n");

        var html = `

            <md-toast class="absolute width height">
                    
                <div class='md-toast-content'>
                    
                    <div class="absolute width height-200 bottom0 black-back opacity70 z-100"></div>

                    <div class='absolute width height-200 bottom0 white font-50 z-100'>
                        <div class="absolute center">
                            ${$message}
                        </div>
                    </div>
                </div>

            </md-toast>

        `


        var $showToastFunction = function () {

            console.log("show toast", $message);

            showing(true);
                    
            $mdToast.show(

                $mdToast.build()
                .template(html)
                .hideDelay(duration)
                .position("top")

            ).then(function () {

                console.log("toast closed");

                showing(false)
            });
        }


        setTimeout(function () {

            if (!showing()) {
                $showToastFunction();
            }

        }, delay)
        
    }


    var hide = function () {

        showing(false);

        $mdToast.hide();
    }


	return {
		showToast:showToast,
        hide:hide,
        showing:showing
	}


}])