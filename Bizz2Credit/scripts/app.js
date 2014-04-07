(function (global) {
        app = global.app = global.app || {};
    
    // Handle device back button tap
    var onBackKeyDown = function(e) {
      if(apps.view()['element']['0']['id']==='tabstrip-login'|| apps.view()['element']['0']['id']==='tabstrip-home'){
        e.preventDefault();
        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
			if (confirmed === true || confirmed === 1) {
               navigator.app.exitApp();
            }
                
        }, 'exit', 'Ok,Cancel');
          }
        else if(apps.view()['element']['0']['id']==='tabstrip-docs' && app.documentsetting.viewModel.showfilter === true)
        {
             app.documentsetting.viewModel.set("showfilter", false);
        }
        else
        {
            apps.navigate("#:back");
        }
    };

    var onDeviceReady = function() {
        navigator.splashscreen.hide();
        $(document.body).height(window.innerHeight);
        document.addEventListener('backbutton', onBackKeyDown, false);
       // document.addEventListener("menubutton",omenu, false);
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);

    if(sessionStorage.getItem("isLoggedIn") === true)
    {
    	apps = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout",initial: "tabstrip-home",skin: "flat"}); 
    }
    else
    {
    	apps = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout",initial: "tabstrip-login",skin: "flat"});
    }
   
    
})(window);