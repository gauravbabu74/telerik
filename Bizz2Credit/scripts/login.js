(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
   
        isLoggedIn:(sessionStorage.getItem("isLoggedIn") === true) ?  true : false,
        username: "",
        password: "",
        onLogin: function () {
            var that = this,
                username = that.get("username").trim(),
                password = that.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                    function () { }, "Login failed", 'OK');

                return;
            }
            
           if(that.checkUser())
            {
               //that.set("isLoggedIn", true);
               sessionStorage.setItem("isLoggedIn",true);
               kendo.history.navigate("#tabstrip-login");
               that.navigateHome();
            }
            else
            {
                sessionStorage.setItem("isLoggedIn",false);
                alert('Please check username and password.');
            }
           
            
        },
		navigateHome: function()
        {            
             apps.navigate("#tabstrip-home");
        },
        onLogout: function () {
            var that = this;
            that.set("isLoggedIn", false);
            sessionStorage.setItem("isLoggedIn",false);      
            apps.navigate("#tabstrip-login");
            that.clearForm();
            closeParentPopover();
            
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
                that.onLogin();
            }
        },
        checkUser: function () {
            var that = this;
            username = that.get("username").trim(),
            password = that.get("password").trim();
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
                loginStatus = "";
                //var loginMsg = data[0]['results']['faultmsg'];
            	if(data[0]['results']['faultcode'] === '1')
                {
                    loginStatus = true;                   
                }
                else{
                    loginStatus = false;
                }
                
          
            });
            if(loginStatus){return true;}else{return false;}
        
        }
    });
    
    app.loginService = {
        viewModel: new LoginViewModel()	
    };
})(window);