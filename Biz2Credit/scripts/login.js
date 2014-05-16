(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
   
        isLoggedIn:(localStorage.getItem("isLoggedIn") === true) ?  true : false,
        username: "",
        password: "",
        validateUser:function()
        {
            var that = this,
            username = that.get("username").trim(),
            password = that.get("password").trim();
            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                    function () { }, "Login failed", 'OK');

                return;
            }
              console.log(window);
            if(!window.connectionInfo.checkConnection()){
                    navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
                	if (confirmed === true || confirmed === 1) {
                		app.loginService.viewModel.validateUser();
                	}

                }, 'Connection Error?', 'Retry,Cancel');
            }
            else{
               
               that.userLogin();  
            }
           
        },
        userLogin: function () {
            var that = this;
            username = that.get("username").trim(),
            password = that.get("password").trim();
            that.showloder();
            var dataSource = new kendo.data.DataSource({
            transport: {
            read: {
                    url: "http://biz2services.com/mobapp/api/user",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"userlogin",userID:username,password:password} // search for tweets that contain "html5"
            }
            },
            schema: {
                data: function(data)
            	{
                	return [data];
            	}
            }
            });
            dataSource.fetch(function(){
                
            	var data = this.data();              
            	if(data[0]['results']['faultcode'] === '1')
                {
                    that.setUserLogin(data[0]['results']['UserData']);
 
                }
                else{
                    that.hideloder();
                    localStorage.setItem("isLoggedIn",false);
                    alert('Please check username and password.');
                    return;
                }            
          
            });      
        },
       
        setUserLogin: function (userinfo) {
             var that = this;
            that.hideloder();
            
            localStorage.setItem("ftpHost",userinfo['ftpHost']);
            localStorage.setItem("ftpPassword",Base64.decode(userinfo['ftpPassword']));
            localStorage.setItem("ftpPath",userinfo['ftpPath']);
            localStorage.setItem("ftpRelativePath",userinfo['ftpRelativePath']);
            localStorage.setItem("ftpUserName",userinfo['ftpUserName']);
            
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("userFName",userinfo['userFName']);
            localStorage.setItem("userLName",userinfo['userLName']);
            localStorage.setItem("userID",userinfo['userID']);
            localStorage.setItem("userEmail",userinfo['userEmail']);
            localStorage.setItem("userMobile",userinfo['userMobile']);
            that.navigateHome();
        },
        
		
        setUserLogout: function () {
            var that = this;
            that.set("isLoggedIn", false);
            localStorage.setItem("isLoggedIn",false);
            localStorage.removeItem("userFName");
            localStorage.removeItem("userLName");
            localStorage.removeItem("userID");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userMobile");
            localStorage.removeItem("ftpHost");
            localStorage.removeItem("ftpPassword");
            localStorage.removeItem("ftpPath");
            localStorage.removeItem("ftpRelativePath");
            localStorage.removeItem("ftpUserName");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userMobile");
            apps.navigate("#tabstrip-login");
            kendo.history.navigate("#tabstrip-login");
            that.clearForm();
            app.homesetting.viewModel.closeParentPopover();
            
        },
        navigateHome: function()
        {  
             
             apps.navigate("#tabstrip-home");
             kendo.history.navigate("#tabstrip-home");
        },
        clearForm: function () {
            var that = this;
            that.set("username", "");
            that.set("password", "");
        },

        checkEnter: function (e) {
            var that = this;

            if (e.keyCode === 13) {
                $(e.target).blur();
                that.validateUser();
            }
        },
        showloder:function()
        {	apps.showLoading();
             setTimeout(function(){
                 apps.hideLoading();
             }, 10000);
        },
        hideloder:function()
        {
            apps.hideLoading();
        },
        refreshHome:function()
        {
           
           
            if(!window.connectionInfo.checkConnection()){
               
                navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            	if (confirmed === true || confirmed === 1) {
                   
            		app.loginService.viewModel.refreshHome();
            	}

            	}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            { 
               app.homesetting.viewModel.homeShow(); 
            }
             app.homesetting.viewModel.closeParentPopover();
        },
        mobileNotification:function(msg,status)
        {
            
            var staticNotification = $("#staticNotification").kendoNotification({
                
           	 appendTo: "#appendto",
            	autoHideAfter: 1000,
                animation: false,
                templates: [
                {
                	type: "warning",
                	template: "<div class='notify'>#= msg #</div>"
				},
                {
               
                	type: "info",
                	template: "<div class='notify'>#= msg #</div>"
                },
                {
               
                	type: "success",
                	template: "<div class='notify'> #= msg #</div>"
                },
                {
               
                	type: "error",
                	template: "<div class='notify'>#= msg #</div>"
                }
                ]
            }).data("kendoNotification");
           
            staticNotification.show(msg, status); 
        },
        closeFileDownloadProcess:function()
        {
           
           $("#tabstrip-download-file").data("kendoMobileModalView").close();
           //if (device.platform.toLowerCase() === "ios") {
            navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
				if (confirmed === true || confirmed === 1) {
               	$("#tabstrip-download-file").data("kendoMobileModalView").close();
            	   app.documentsetting.viewModel.transferFileAbort();
            	}
                
        	}, 'exit', 'Ok,Cancel');
           // }
        },
    });
    
    app.loginService = {
        viewModel: new LoginViewModel()	
    };
})(window);