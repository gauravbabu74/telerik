(function (global,$) {
    var DocumentsViewModel,
        app = global.app = global.app || {};

    DocumentsViewModel = kendo.data.ObservableObject.extend({
        documents:[],
        showfilter:false,
        innerPage:false,
        parentPage:'',
        parentId:0,
        showrefreshLoading:false,
        newFolderName:'',
        renameFolderName:'',
        currentFolderName:(sessionStorage.getItem("currentFName") === true) ?  sessionStorage.getItem("currentFName") : "",
		documentShow:function(e)
        { 
            app.loginService.viewModel.showloder();
            if(typeof e.view.params.parent !== "undefined")
            {
                parentId = e.view.params.parent;
                app.documentsetting.viewModel.setInnerPage();
                app.documentsetting.viewModel.setParentId(e.view.params.parent);
                
            }
            else
            {
                parentId = 0;
                app.documentsetting.viewModel.setMainPage();
                app.documentsetting.viewModel.setParentId(0);
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
                    }
                	return [docsArray];
                }
            },
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
               that.set("documents", data['0']);
            $("#list-edit-listview").kendoMobileListView({
                dataSource: app.documentsetting.viewModel.documents,
                template: $("#docs-template").html(),
                filterable: {
                field: "name",
                operator: "startswith"
                },
                }).kendoTouch({ 
                	filter: ">li",
                	tap: function (e) {    
                		if(!hold)
                		{
                			apps.navigate('#tabstrip-docs?parent='+e.touch.currentTarget.id);
               		 }
                	},
                	touchstart: function (e) {
                		hold = false;
               	 },
                	hold: function (e) {
                        //console.log(e);
                        sessionStorage.currentFId = e.touch.currentTarget.id;
                        sessionStorage.currentFName = e.touch.currentTarget.innerText;
                		hold = true;
                		navigator.notification.vibrate(100);
                		$("#tabstrip-folder-events").data("kendoMobileModalView").open();
                		$("#tabstrip-folder-events").find(".km-scroll-container").css("-webkit-transform", "");
                		$('.folderName').html('');
                		$('.folderName').append('<span>'+e.touch.currentTarget.innerText+'</span>');
                		$('.folderName').attr("id",e.touch.currentTarget.id)
                	}                    
            });
            $('#docs-filter').html('');
            $(".km-filter-form").detach().appendTo('#docs-filter');
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
        
        refreshView:function(e)
        {
         
            if( app.documentsetting.viewModel.parentId === 0)
            {
                parentId = 0;
            }
            else
            {
                parentId =  app.documentsetting.viewModel.parentId;    
            }
            console.log(parentId);
            var that = this;
            that.set("showrefreshLoading", true);
       	 var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/folder/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: {apiaction:"getlistfilesfolders",userID:localStorage.getItem("userID"),parentID:parentId}  // search for tweets that contain "html5"
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
                    }
                	return [docsArray];
                }
            },
     
        });
             
        dataSource.fetch(function(){
            var data = dataSource.view(); 
            app.documentsetting.viewModel.setDocuments(data);
            app.documentsetting.viewModel.hideRefreshLoading();
            
        });   
        },
        thisFolderDelete:function()
        {
            
             //$("#tabstrip-delete-folder").data("kendoMobileModalView").open();
        },
        deleteFolder:function(e)
        { 
             folderEventsCloseModal();
             $("#tabstrip-delete-folder").data("kendoMobileModalView").open();
        },
        thisFolderRename:function()
        {
            var that = this;
            var renameFolder = that.get("renameFolderName");
		    var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/folder",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: {apiaction:"renamefolder",userID:localStorage.getItem("userID"),folderID:sessionStorage.getItem("currentFId"),folderName:renameFolder,parentID:parentId}  // search for tweets that contain "html5"
                }
            },    
            schema: {
                 data: function(data)
                {   
                	return [data];
                }
            },
     
        });
             
        dataSource.fetch(function(){
            var data = dataSource.data(); 

            console.log(data);
        }); 
       // newFolderCloseModal();
       // app.documentsetting.viewModel.refreshView(); 
            
        },
        renameFolder:function(e)
        {
            folderEventsCloseModal();
             $("#tabstrip-rename-folder").data("kendoMobileModalView").open();
        },
        moveFolder:function(e)
        {
            alert('move call');
        },
        hideRefreshLoading:function()
        {
            var that = this;
            that.set("showrefreshLoading", false);
        },
        setParentId:function(id)
        {
            var that = this;
            that.set("parentId", id);
        },
        newFolderModal:function()
        { 
            $("#tabstrip-new-folder").data("kendoMobileModalView").open();  
        },
        newFolderCreate:function()
        {
            var that = this;
            newFolderName = that.get("newFolderName");

             var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/folder",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: {apiaction:"addfolder",userID:localStorage.getItem("userID"),parentID:parentId,folderName:newFolderName}  // search for tweets that contain "html5"
                }
            },    
            schema: {
                 data: function(data)
                {   
                	return [data];
                }
            },
     
        });
             
        dataSource.fetch(function(){
            var data = dataSource.data(); 

            console.log(data);
        });   
        newFolderCloseModal();
        app.documentsetting.viewModel.refreshView(); 
        },
        setUserLogout:function()
        {
            app.loginService.viewModel.setUserLogout();
        }
    });
    app.documentsetting = {
        
		viewModel: new DocumentsViewModel(),     	
    };
 
})(window,jQuery);
