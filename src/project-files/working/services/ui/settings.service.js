app.factory("settings.service", [function () {




    var s = window.shared;
    var g = s.utility_service;
    var send = s.send_service;
    var react = s.react_service;
    var events = s.events_service;



	/* 
    #_______________________________________
    #
    #
    #   Settings kind support functions
    #
    #
    #_________________________________________
    */



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
            class:"z-80",
            color:"black"
        },
        closed:{
            top:"20px",
            opacity:1,
            zIndex:10,
            class:"z-60",
            color:"white"
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
            openedSign:$("#settings-" + kind.value + "-active-cover")
        }
    }

    var toggleTab = function (kind) {


        tabElem(kind).main.css({
            top:getTabParam(kind, "top"),
            zIndex:getTabParam(kind, "zIndex"),
            color:getTabParam(kind, "color")
        });


        tabElem(kind).openedSign.css({
            opacity:1-getTabParam(kind, "opacity")
        });


        tabElem(kind).settings
        .removeClass(kind.status ? tabParams.closed.class : tabParams.opened.class)
        .addClass(getTabParam(kind, "class"));


        // tabElem(kind).openedSign
        // .removeClass(kind.status ? tabParams.closed.color : tabParams.opened.color)
        // .addClass(getTabParam(kind, "color"));
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
    var openStatus = {opened:true, right:{opened:0, closed:(-1)*settingsWidth}};


    var animateToggle = function (open_up) {

        g.waitForElem({elems:"#settingstoggle"}, function () {

            $(controls[0].tool).animate({opacity:0}, 200);
            $("#settingstoggle").animate({
                
                right:
                
                (

                 open_up ? openStatus.right.closed

                 :

                 (

                  (!openStatus.opened || open_up) 
                  ? openStatus.right.opened 
                  : openStatus.right.closed

                  )

                )

            }, 
            {
                
                duration:100, 
                complete:function () {
                    openStatus.opened = !openStatus.opened;
                }

            });

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
		isFocus:isFocus
	}



}]);