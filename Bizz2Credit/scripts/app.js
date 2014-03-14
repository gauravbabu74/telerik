(function (global) {
        app = global.app = global.app || {};
    
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        $(document.body).height(window.innerHeight);
    }, false);
    apps = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout",initial: "tabstrip-login",skin: "flat", webAppCapable: false});

})(window);