(function (global,$) {
    var HomepageViewModel,
        app = global.app = global.app || {};

    HomepageViewModel = kendo.data.ObservableObject.extend({

        dHeader:(window.localStorage.getItem("dHeader") !== null) ?  localStorage.getItem("dHeader") : '',
        dDescription:(window.localStorage.getItem("dDescription") !== null) ?  localStorage.getItem("dDescription") : '',
        dButtonText :(window.localStorage.getItem("dButtonText") !== null) ?  localStorage.getItem("dButtonText") : '',
        dButtonLink:(window.localStorage.getItem("dButtonLink") !== null) ?  localStorage.getItem("dButtonLink") : '',
        homeShow: function () {       
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/user/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"userdashboard",userid:12516} // search for tweets that contain "html5"
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
            var that = this;
            var data = that.data();
            console.log(data[0]['results']);
            var cntGetStarted = data[0]['results']['data']['cntGetStarted'];
            var userName= app.loginService.viewModel.get("username");
            //if((cntGetStarted>=1 && loan_total===0) || (loan_total===loan_ended)) {
            dHeader ='Hi '+userName+', we have potential options for you!';
            dDescription='Please start your application in order to get matched to pre-qualified funding opportunities';
            dButtonText = "Start an Application";
            dButtonLink ="#";
            app.homesetting.viewModel.setcache(dHeader,dDescription,dButtonText,dButtonLink);
           
        });    
        },       
		setcache:function(dHeader,dDescription,dButtonText,dButtonLink)
        {
            var that = this; 
            that.set("dHeader",dHeader);
            that.set("dDescription",dDescription);
            that.set("dButtonText",dButtonText);
            that.set("dButtonLink",dButtonLink);
            app.loginService.viewModel.hideloder();
        }
    });
    app.homesetting = {
        checkMatchesStatus: function(msdata)
        {
            $.each(msdata, function( index, value ) {
                if(value.statusid > 1){
                	return false;
                }
            });
            return true;
        },
        initHome: function () {
        app.loginService.viewModel.showloder();
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/user/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"userdashboard",userid:12516} // search for tweets that contain "html5"
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
            var that = this;
            var data = that.data(); 
            var cntGetStarted = data[0]['results']['data']['cntGetStarted'];
            var loan_total = data[0]['results']['data']['loan']['total'];
            var matchstatus = data[0]['results']['data']['matchstatus'];
            var funded = data[0]['results']['data']['funded'];				
            if(cntGetStarted === 0 && loan_total === 0){
            	pos = 0;
            }
            if(matchstatus === 2 && loan_total > 0){
            	pos = 1;
            }
            if(matchstatus === 0 && app.homesetting.checkMatchesStatus(data[0]['results']['data']['loan']['matchrows'])){
            	pos = 2;
            }
            if(matchstatus === 1){
            	pos = 2;
            }else if(matchstatus === 1 && funded === 0){
            	pos = 3;
            }
            if(matchstatus === 1 && funded === 1){
            	pos = 4;
            }  
            $('#stps ul li').removeClass();
            $('#stps ul li:eq('+pos+')').addClass('activ');
            $('#stps ul li:lt('+pos+')').addClass('dn');
        });      
        },
		viewModel: new HomepageViewModel(),     	
    };
 
})(window,jQuery);