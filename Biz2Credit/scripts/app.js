(function (global) {
        app = global.app = global.app || {};
    
    // Handle device back button tap
    var onBackKeyDown = function(e) {
        //alert(apps.view()['element']['0']['id']);
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
        else if(apps.view()['element']['0']['id']==='tabstrip-docs' || apps.view()['element']['0']['id']==='tabstrip-movedocs')
        {
            e.preventDefault();
        }
        else
        {   //$("#tabstrip-folder-events").kendoMobileModalView("close");
            $("#tabstrip-mess-fourth").data("kendoMobileModalView").close();
            $("#tabstrip-mess-dynamic").data("kendoMobileModalView").close();
            $("#tabstrip-mess-third").data("kendoMobileModalView").close();
            $("#tabstrip-mess-two").data("kendoMobileModalView").close();
            $("#tabstrip-mess-one").data("kendoMobileModalView").close();
            apps.navigate("#:back");
           
        }
    };

    var onDeviceReady = function() {
        navigator.splashscreen.hide();
       // $(document.body).height(window.innerHeight);
        document.addEventListener('backbutton', onBackKeyDown, false);
       // document.addEventListener("menubutton",omenu, false);
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);
    if(localStorage.getItem("isLoggedIn") === 'true')
    {
    	apps = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout",initial: "tabstrip-home",skin: "flat"}); 
    }
    else
    {
    	apps = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout",initial: "tabstrip-login",skin: "flat"});
    }
   
    
})(window);