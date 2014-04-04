(function (global,$) {
    var DocumentsViewModel,
        app = global.app = global.app || {};

    DocumentsViewModel = kendo.data.ObservableObject.extend({
        documents:[],
        showfilter:false,
		documentShow:function()
        {
            app.loginService.viewModel.showloder();
       	 var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/user/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"userdashboard",userid:sessionStorage.getItem("userID")} // search for tweets that contain "html5"
                }
            },
            schema: {
                data: function(data)
                {   var i=0;
                    var max = i + 35;
                    var data1 = [];
                    for (; i < max; i ++) {
                    data1.unshift({ appid: "record" + i, modified: +new Date() });
                    }
                	return [data1];
                }
            }
        });
        dataSource.fetch(function(){
            var that = this;
            var data = that.data();
            app.documentsetting.viewModel.setDocuments(data);
            
        });
       
       }, 
        setDocuments: function(data)
        { 
               var that = this;
             //console.log(data);
               that.set("documents", data['0']);
              //console.log(data);
               app.loginService.viewModel.hideloder();
               
        },
        setVisibilty:function()
        {
            var that = this;
            if(app.documentsetting.viewModel.showfilter === true)
            {
                that.set("showfilter", false);
            }
            else
            {
                that.set("showfilter", true);
            }
             
        },
        refreshView:function()
        {
           app.loginService.viewModel.showloder();
       	 var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/user/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"userdashboard",userid:sessionStorage.getItem("userID")} // search for tweets that contain "html5"
                }
            },
                 
            schema: {
                data: function(data)
                {   var i=0;
                    var max = i + 10;
                    var data1 = [];
                    for (; i < max; i ++) {
                    data1[i]={ appid: "record" + i};
                    }
                    console.log(data1)
                	return [data1];
                }
            },
           filter:{ logic: "or", filters: [ { field: "appid", operator: "startswith", value: "Jane" } ] } ,   
           
                
        });
             
        dataSource.fetch(function(){
            var data = dataSource.view();
            console.log(data)
            app.documentsetting.viewModel.setDocuments(data);
            
        });
        }
    });
    app.documentsetting = {
        
		viewModel: new DocumentsViewModel(),     	
    };
 
})(window,jQuery);
