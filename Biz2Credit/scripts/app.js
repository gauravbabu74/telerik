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
        else if(apps.view()['element']['0']['id']==='tabstrip-docs' || apps.view()['element']['0']['id']==='tabstrip-movedocs')
        {
            e.preventDefault();
        }
        else
        { 
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
        document.addEventListener('backbutton', onBackKeyDown, false);
        window.connectionInfo = new ConnectionApp();
		window.connectionInfo.checkConnection();
       // document.addEventListener("menubutton",omenu, false);
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);
   /// alert(localStorage.getItem("isLoggedIn"));
    function ConnectionApp() {
	}
 
    ConnectionApp.prototype = { 	
    	checkConnection: function() {
    			if(typeof navigator.connection.type !== "undefined")
                {
                    var networkState = navigator.connection.type;
                    var states = {};
                    states[Connection.UNKNOWN] = 'Unknown connection';
                    states[Connection.ETHERNET] = 'Ethernet connection';
                    states[Connection.WIFI] = 'WiFi connection';
                    states[Connection.CELL_2G] = 'Cell 2G connection';
                    states[Connection.CELL_3G] = 'Cell 3G connection';
                    states[Connection.CELL_4G] = 'Cell 4G connection';
                    states[Connection.CELL] = 'Cell generic connection';
                    states[Connection.NONE] = 'No network connection';
                    if (states[networkState] === 'No network connection') {
                        return false;
                    }
                }
                
                return true;
    	},
        
    }
    if(localStorage.getItem("isLoggedIn") === 'true')
    {
        
    	apps = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout",initial: "tabstrip-home",skin: "flat"}); 
    }
    else
    {
    	apps = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout",initial: "tabstrip-login",skin: "flat"});
    }
   
    
})(window);