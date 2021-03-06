(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
   
        isLoggedIn:(sessionStorage.getItem("isLoggedIn") === true) ?  true : false,
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
            if(!that.checkConnection()){
                    return;
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
                //var loginMsg = data[0]['results']['faultmsg'];
                //console.log(data);
            	if(data[0]['results']['faultcode'] === '1')
                {
                    that.setUserLogin(data[0]['results']['UserData']);
 
                }
                else{
                    that.hideloder();
                    sessionStorage.setItem("isLoggedIn",false);
                    alert('Please check username and password.');
                    return;
                }            
          
            });      
        },
       
        setUserLogin: function (userinfo) {
            var that = this;
            that.hideloder();
            sessionStorage.setItem("isLoggedIn",true);
            sessionStorage.setItem("userFName",userinfo['userFName']);
            sessionStorage.setItem("userLName",userinfo['userLName']);
            sessionStorage.setItem("userID",userinfo['userID']);
            sessionStorage.setItem("userEmail",userinfo['userEmail']);
            sessionStorage.setItem("userMobile",userinfo['userMobile']);
            that.navigateHome();
        },
        
		
        setUserLogout: function () {
            var that = this;
            that.set("isLoggedIn", false);
            sessionStorage.setItem("isLoggedIn",false);
            sessionStorage.removeItem("userFName");
            sessionStorage.removeItem("userLName");
            sessionStorage.removeItem("userID");
            sessionStorage.removeItem("userEmail");
            sessionStorage.removeItem("userMobile");
            apps.navigate("#tabstrip-login");
            kendo.history.navigate("#tabstrip-login");
            that.clearForm();
            closeParentPopover();
            
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
        {
            apps.showLoading();
        },
        hideloder:function()
        {
            apps.hideLoading();
        },
        refreshHome:function()
        {
            app.homesetting.viewModel.homeShow();
            closeParentPopover();
        },
        checkConnection:function()
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
                navigator.notification.alert('No active connection found!');
                return false;
            }
            return true;
        },
    });
    
    app.loginService = {
        viewModel: new LoginViewModel()	
    };
})(window);