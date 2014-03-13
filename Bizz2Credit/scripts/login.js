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
            var dataSource = new kendo.data.DataSource({
            transport: {
            read: {
                  url: "http://demos.telerik.com/kendo-ui/service/products",
                  dataType: "jsonp", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                  }
            }
            });
            dataSource.fetch(function() {
                  console.log(dataSource.data()); // displays "77"
            });
            return true;
        }
    });
     app.homesetting = {
        viewModel: new LoginViewModel()	
    };
    app.loginService = {
        viewModel: new LoginViewModel()	
    };
})(window);