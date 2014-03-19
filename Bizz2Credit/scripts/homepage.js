(function (global) {
    var HomepageViewModel,
        app = global.app = global.app || {};

    HomepageViewModel = kendo.data.ObservableObject.extend({
        
        title:'test',
        description:'gaurav',
        
        
    });
     app.homesetting = {
         viewModel: new HomepageViewModel(),
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
                
            	var data = this.data(); 
                
                var cntGetStarted = data[0]['results']['data']['cntGetStarted'];
                var loan_total = data[0]['results']['data']['loanamt'];
                var matchstatus = data[0]['results']['data']['matchstatus'];
                var funded = data[0]['results']['data']['funded'];

                if(cntGetStarted == 0 && loan_total == 0){
					pos = 1;
				}
		
				if(matchstatus == 2 && loan_total > 0){
					pos = 2;
				}
				if(matchstatus == 0){
					pos = 3;
				}
				if(matchstatus == 1){
					pos = 3;
				}else if(matchstatus == 1 && funded == 0){
					pos = 4;
				}
				if(matchstatus == 1 && funded == 1){
					pos = 5;
				}     
                //alert(pos);
                app.loginService.viewModel.hideloder();
			});      
        }
           	
    };
 
})(window);