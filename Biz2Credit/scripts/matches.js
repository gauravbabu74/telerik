(function (global,$) {
    
    var MatchespageViewModel,
   app = global.app = global.app || {};
    MatchespageViewModel = kendo.observable({
       Matches : [],
       getMatches: function () {
       app.loginService.viewModel.showloder();
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "https://www.biz2services.com/mobapp/api/user/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"userdashboard",userid:localStorage.getItem("userID")} // search for tweets that contain "html5"
                }
            },
            schema: {
                data: function(data)
                {
                    //console.log(data);
                    
                	return [data['results']['data']['loan']['matchrows']];
                }
            }
        });
        dataSource.fetch(function(){
            var that = this;
            var data = that.data();
           // console.log(data);
            MatchespageViewModel.setMatches(data);
         });
        	   
        },    
        setMatches: function(data)
           { 
               var that = this;
               that.set("Matches", data['0']);
               app.loginService.viewModel.hideloder();
           },
     
   
    });
$.extend(window, {

		MatchespageViewModel: MatchespageViewModel
	});
    
})(window,jQuery);