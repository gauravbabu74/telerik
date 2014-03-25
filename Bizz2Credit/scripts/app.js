(function (global) {
        app = global.app = global.app || {};
    
    // Handle device back button tap
    var onBackKeyDown = function(e) {

        e.preventDefault();

        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
			if (confirmed === true || confirmed === 1) {
               navigator.app.exitApp();
            }
                
        }, 'exit', 'Ok,Cancel');
    };

    var onDeviceReady = function() {
        navigator.splashscreen.hide();
        $(document.body).height(window.innerHeight);
        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);
        //document.addEventListener("menubutton",omenu, false);
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);

   
   // document.addEventListener('deviceready', function () {
       // navigator.splashscreen.hide();
       // $(document.body).height(window.innerHeight);
   // }, false);

    apps = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout",initial: "tabstrip-login",skin: "flat"});
})(window);