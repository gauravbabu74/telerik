(function (global,$) {
    var DocumentsViewModel,
        app = global.app = global.app || {};

    DocumentsViewModel = kendo.data.ObservableObject.extend({
        documents:[],
        showfilter:false,
		documentShow:function()
        {
            app.loginService.viewModel.showloder();
            $(".km-filter-form").detach().appendTo('#docs-filter');
       	 var dataSource = new kendo.data.DataSource({
                
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/folder/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"getcatetree",userID:localStorage.getItem("userID")} // search for tweets that contain "html5"
                }
            },
            schema: {
                data: function(data)
                { 
                    console.log(data['results']['DocLists'].filter(function(index){if(index['CreatedStatus']==='Online'){ return true}})) ;       
                	return [data['results']['DocLists'].filter(function(index){if(index['CreatedStatus']==='Online'){ return true}}).reverse()];
                }
            },
  
  
        });
        dataSource.fetch(function(){
            var that = this;
            var data = that.data();
            //console.log(dataSource)
            app.documentsetting.viewModel.setDocuments(data);
            
        });
       
       }, 
        setDocuments: function(data)
        { 
               var that = this;
               //console.log(data);
            
               that.set("documents", data['0']);
             // console.log(data);
               app.loginService.viewModel.hideloder();
               
        },
        setVisibilty:function()
        {
            var that = this;
            $(".km-filter-reset").trigger("click");
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
                    url: "http://biz2services.com/mobapp/api/folder/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"getcatetree",userID:localStorage.getItem("userID")} // search for tweets that contain "html5"
                }
            },
                 
            schema: {
                data: function(data)
                { 
                    console.log(data['results']['DocLists'].filter(function(index){if(index['CreatedStatus']==='Online'){ return true}})) ;       
                	return [data['results']['DocLists'].filter(function(index){if(index['CreatedStatus']==='Online'){ return true}}).reverse()];
                }
            },
     
        });
             
        dataSource.fetch(function(){
            var data = dataSource.view();
            //console.log(dataSource);
            app.documentsetting.viewModel.setDocuments(data);
            
        });
        }
    });
    app.documentsetting = {
        
		viewModel: new DocumentsViewModel(),     	
    };
 
})(window,jQuery);
