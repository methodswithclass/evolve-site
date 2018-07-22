app.factory("settings.service", [function () {



	/* 
    #_______________________________________
    #
    #
    #   Settings kind support functions
    #
    #
    #_________________________________________
    */


    var kindStatus = {
        opened:"z-80",
        closed:"z-60"
    }

    var kinds = [
    {
        id:0,
        value:"basic",
        status:true
    },
    {
        id:1,
        value:"advanced",
        status:false
    }
    ]

    var tabParams = {
        opened:{
            top:0,
            opacity:0,
            zIndex:20,
            class:kindStatus.opened
        },
        closed:{
            top:"20px",
            opacity:1,
            zIndex:10,
            class:kindStatus.closed
        }
    }

    var toggleKind = kinds[0];

    var toggleKindType = function (kindValue) {

        toggleKind = kinds.find(function (p) {

            return p.value == kindValue;
        });


        kinds = kinds.map(function (value, index) {

            if (value.value == toggleKind.value) {

                // sets toggle kind status to true (indicates that kindValue tab has been selected opened)

                value.status = true;
            }
            else {

                // indicates all other tabs closed

                value.status = false;
            }

            return value;

        })

        return toggleKind;
    }

    var getTabParam = function (kind, param) {

        return kind.status ? tabParams.opened[param] : tabParams.closed[param];
    }

    var tabElem = function (kind) {
        
        return {
            main:$("#" + kind.value + "-tab"),
            cover:$("#settings-" + kind.value + "-cover"),
            settings:$("#settings-" + kind.value),
            closedSign:$("settings-" + kind.value + "-inactive-cover")
        }
    }

    var toggleTab = function (kind) {


        tabElem(kind).main.css({
            top:getTabParam(kind, "top"),
            zIndex:getTabParam(kind, "zIndex")
        });

        tabElem(kind).cover.css({
            // top:getTabParam(kind, "top"), 
            opacity:getTabParam(kind, "opacity")
        });

        tabElem(kind).settings
        .removeClass(kind.status ? tabParams.closed.class : tabParams.opened.class)
        .addClass(getTabParam(kind, "class"));

    }



    /*_____________________________________________________________________________*/




   /* 
    #_______________________________________
    #
    #
    #   Settings open/close toggle support functions
    #
    #
    #_________________________________________
    */



    var controls = [
    {
        name:"open",
        input:"#opensettings",
        tool:"#opentool"
    }
    ]

    var inputs = [
    {
        input:"#gensinput"
    },
    {
        input:"#runsinput"
    },
    {
        input:"#goalinput"
    },
    {
        input:"#popinput"
    },
    {
        input:"#refreshbtn"
    }
    ]

    $stage = $("#stage");


    var setHover = function (i) {

        controls.forEach(function(value, index) {

            $(value.input).hover(
                function() {
                    $(value.tool).animate({opacity:1}, 100);
                },
                function () {
                    $(value.tool).animate({opacity:0}, 100);
                }
            );

        })
    }

    // setHover();

    var isFocus = function () {

       
        for (var i in inputs) {
            

            if ($(inputs[i].input).is(":focus")) {
                return true;
            }

        }
               
        return false;
    }

    var settingsWidth = 800;
    var width = 0.6;
    var toggleOpened = true;
    var openStatus = {opened:false, right:{opened:-20, closed:(-1)*settingsWidth}};
            


    var animateToggle = function (open_up) {

        $(controls[0].tool).animate({opacity:0}, 200);
        $("#settingstoggle").animate({
            
            right:
            
            (
             (!open_up || openStatus.opened) 
             ? openStatus.right.closed

             : (
                (open_up || openStatus.closed) 
                ? openStatus.right.opened 
                : openStatus.right.closed
                )
             )

        }, 
        {
            
            duration:300, 
            complete:function () {
                openStatus.opened = !openStatus.opened;
            }

        });

    }


    var changeKind = function (kindValue) {

    	kinds.map(function (value, index) {

            toggleKindType(kindValue)

            toggleTab(value);

        });
    }




	return {
		animateToggle:animateToggle,
		changeKind:changeKind,
		setHover:setHover,
		isFocus:isFocus,
		toggleOpened:toggleOpened
	}



}]);