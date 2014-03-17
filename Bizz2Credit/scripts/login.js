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
            	if(data[0]['results']['faultcode'] === '1')
                {
                    that.setUserLogin();
 
                }
                else{
                    that.hideloder();
                    sessionStorage.setItem("isLoggedIn",false);
                    alert('Please check username and password.');
                    return;
                }            
          
            });      
        },
       
        setUserLogin: function () {
               var that = this;
               that.hideloder();
               sessionStorage.setItem("isLoggedIn",true);
               kendo.history.navigate("#tabstrip-login");
               that.navigateHome();
        },
        
		
        setUserLogout: function () {
            var that = this;
            that.set("isLoggedIn", false);
            sessionStorage.setItem("isLoggedIn",false);      
            apps.navigate("#tabstrip-login");
            that.clearForm();
            closeParentPopover();
            
        },
        navigateHome: function()
        {            
             apps.navigate("#tabstrip-home");
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
            apps.pane.loader.show();
        },
        hideloder:function()
        {
            apps.pane.loader.hide();
        }
    });
    
    app.loginService = {
        viewModel: new LoginViewModel()	
    };
})(window);