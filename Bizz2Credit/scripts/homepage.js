(function (global,$) {
    var HomepageViewModel,
        app = global.app = global.app || {};

    HomepageViewModel = kendo.data.ObservableObject.extend({
        
        title:'test',
        description:'gaurav',
        
        
    });
     app.homesetting = {
         viewModel: new HomepageViewModel(),
         checkMatchesStatus: function(msdata)
         {
             console.log(msdata);
             $.each(msdata, function( index, value ) {
  			if(value.statusid >= 1){
                  return true;
              }
			});
             return false;
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
                var loan_total = data[0]['results']['data']['loanamt'];
                var matchstatus = data[0]['results']['data']['matchstatus'];
                var funded = data[0]['results']['data']['funded'];
				//console.log(data);
                //console.log(loan_total);
                //console.log(matchstatus);
               // console.log(app);
                
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
                //alert(pos);
                console.log(pos);
                $('#stps ul li').removeClass();
                $('#stps ul li:eq('+pos+')').addClass('activ');
                $('#stps ul li:lt('+pos+')').addClass('dn');
                //alert(pos);
                app.loginService.viewModel.hideloder();
			});      
        },
        
           	
    };
 
})(window,jQuery);