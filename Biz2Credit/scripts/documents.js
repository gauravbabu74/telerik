(function (global,$) {
    var DocumentsViewModel,
        app = global.app = global.app || {};

    DocumentsViewModel = kendo.data.ObservableObject.extend({
        documents:[],
        showfilter:false,
        innerPage:false,
        parentPage:'',
        
		documentShow:function(e)
        { 
            app.loginService.viewModel.showloder();
            if(typeof e.view.params.parent !== "undefined")
            {
                var parentId = e.view.params.parent;
                app.documentsetting.viewModel.setInnerPage();
                
            }
            else
            {
                var parentId = 0;
                app.documentsetting.viewModel.setMainPage();
            }
        
            
            
            if(typeof $("#docs-filter .km-filter-form").attr("Class") === 'undefined'){
                $(".km-filter-form").detach().appendTo('#docs-filter');
            }
            
       	 var dataSource = new kendo.data.DataSource({
                
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/folder/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: {apiaction:"getlistfilesfolders",userID:localStorage.getItem("userID"),parentID:parentId} // search for tweets that contain "html5"
                }
            },
            schema: {
                data: function(data)
                {   var docsArray = [];
                    if(data['results']['faultcode']===1)
                    {
                        
                        var sharedFiles ="";
                            var sharedFolders ="";
                        $.each( data['results']['DocLists'], function( i, val ) {
                            
                            
                            if(data['results']['DocLists'][i]['name']==='Shared Files'){
                                 sharedFiles =val;
                            }
                            else if(data['results']['DocLists'][i]['name']==='Shared Folders' ){
                                 sharedFolders =val;
                            }
                            else{
                                docsArray.push(val);
                            } 
    					});
                        if(sharedFiles !== '' && sharedFolders !=='')
                        {
                        	docsArray.unshift(sharedFiles,sharedFolders);
                        }
                        console.log(data);
                    }
                	return [docsArray];
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
        innerDocumentShow:function(e)
        {   
            app.loginService.viewModel.showloder();
            $(".km-filter-form").detach().appendTo('#docs-filter');
       	 var dataSource = new kendo.data.DataSource({
                
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/folder/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: {apiaction:"getlistfilesfolders",userID:localStorage.getItem("userID"),parentID:"0"} // search for tweets that contain "html5"
                }
            },
            schema: {
                data: function(data)
                { 
                    
                    var docsArray = [];
                    $.each( data['results']['DocLists'], function( i, val ) {
                        
                        
                        if(data['results']['DocLists'][i]['name']==='Shared Files'){
                            sharedFiles =val;
                        }
                        else if(data['results']['DocLists'][i]['name']==='Shared Folders' ){
                            sharedFolders =val;
                        }
                        else{
                            docsArray.push(val);
                        } 
					});
                    docsArray.unshift(sharedFiles,sharedFolders);
                    console.log(docsArray)
                	return [docsArray];
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
        setInnerPage:function()
        {
            var that = this;
            
           
            that.set("innerPage", true);
          
             
        },
        setMainPage:function()
        {
            var that = this;
            
           
            that.set("innerPage", false);
          
             
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
                    data: {apiaction:"getlistfilesfolders",userID:localStorage.getItem("userID"),parentID:"0"}  // search for tweets that contain "html5"
                }
            },
                 
            schema: {
                data: function(data)
                { 
                    
                    var docsArray = [];
                    $.each( data['results']['DocLists'], function( i, val ) {
                        
                        
                        if(data['results']['DocLists'][i]['name']==='Shared Files'){
                            sharedFiles =val;
                        }
                        else if(data['results']['DocLists'][i]['name']==='Shared Folders' ){
                            sharedFolders =val;
                        }
                        else{
                            docsArray.push(val);
                        } 
					});
                    docsArray.unshift(sharedFiles,sharedFolders);
                	return [docsArray];
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
