(function (global,$) {
    var HomepageViewModel,
        app = global.app = global.app || {};

    HomepageViewModel = kendo.data.ObservableObject.extend({

        dHeader:(window.localStorage.getItem("dHeader") !== null) ?  localStorage.getItem("dHeader") : '',
        dDescription:(window.localStorage.getItem("dDescription") !== null) ?  localStorage.getItem("dDescription") : '',
        dButtonText :(window.localStorage.getItem("dButtonText") !== null) ?  localStorage.getItem("dButtonText") : '',
        dButtonLink:(window.localStorage.getItem("dButtonLink") !== null) ?  localStorage.getItem("dButtonLink") : '',
        init:function()
        {  
        	kendo.data.ObservableObject.fn.init.apply(this, [this])
        	localStorage.clear();
        },
    });
    app.homesetting = {
        setLocalstorae:function(dHeader,dDescription,dButtonText,dButtonLink)
        {
            window.localStorage.setItem("dHeader", dHeader);
            window.localStorage.setItem("dDescription", dDescription);
            window.localStorage.setItem("dButtonText", dButtonText);
            window.localStorage.setItem("dButtonLink", dButtonLink);
        },
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
        //alert('init')
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
            var dHeader="";
            var dDescription="";
            var dButtonText="";
            var dButtonLink=""
            var cntGetStarted = data[0]['results']['data']['cntGetStarted'];
            var loan_total = data[0]['results']['data']['loan']['total'];
            var loan_ended = data[0]['results']['data']['loan']['ended'];
            var loan_posted = data[0]['results']['data']['loan']['posted'];
            var matchstatus = data[0]['results']['data']['matchstatus'];
            var funded = data[0]['results']['data']['funded'];
            var totmatch = data[0]['results']['data']['loan']['matches'];				

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
            console.log(sessionStorage.getItem("userinfo"));
            //console.log(app);
            //if((cntGetStarted>=1 && loan_total===0) || (loan_total===loan_ended)) {
            dHeader ='Hi '+matchstatus+', we have '+totmatch+' potential options for you!';
            dDescription='Please start your application in order to get matched to pre-qualified funding opportunities';
            dButtonText = "Start an Application";
            dButtonLink ="#";
            //}
            app.homesetting.setLocalstorae(dHeader,dDescription,dButtonText,dButtonLink);
            app.loginService.viewModel.hideloder();
        });      
        },
		viewModel: new HomepageViewModel(),     	
    };
 
})(window,jQuery);