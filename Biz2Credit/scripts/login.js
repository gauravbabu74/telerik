(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
   
        isLoggedIn:(localStorage.getItem("isLoggedIn") === true) ?  true : false,
        username: "",
        password: "",
        email:"",
        name:"",
        validateUser:function()
        {
            var that = this,
            username = that.get("username").trim(),
            password = that.get("password").trim();
            
            
            if (username === "") {
                navigator.notification.alert("Please enter your username",
                    function () { }, "Notification", 'OK');

                return;
            }
            if (password === "") {
                navigator.notification.alert("Please enter your password",
                    function () { }, "Notification", 'OK');

                return;
            }
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
                    url: "https://www.biz2services.com/mobapp/api/user",
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
                    navigator.notification.alert("Login failed. Invalid username/password",
                    function () { }, "Notification", 'OK');
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
            that.setSettingsPage();
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
            that.set("email", "");
            that.set("name", "");
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
            	autoHideAfter: 2000,
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
        onSettingPage:function(e)
        {	apps.navigate('#tabstrip-Setting');
             app.homesetting.viewModel.closeParentPopover();
            
        },
        setSettingsPage:function()
        {
 
            var that = this;
            that.set("email", localStorage.getItem("userEmail"));
            that.set("name", localStorage.getItem("userFName")+' '+localStorage.getItem("userLName"));
        }
        
    });
    
    app.loginService = {
        viewModel: new LoginViewModel()	
    };
})(window);