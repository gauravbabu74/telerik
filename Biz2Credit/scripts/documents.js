(function (global,$) {
    var DocumentsViewModel,
        app = global.app = global.app || {};

    DocumentsViewModel = kendo.data.ObservableObject.extend({
        documents:[],
        showfilter:false,
        innerPage:false,
        parentId:0,
        showrefreshLoading:false,
        newFolderName:'',
        renameFolderName:'',
        moveDocsId:0,
        moveInnerPage:false,
        documentShow:function(e)
        { 

            if(typeof $("#list-edit-listview").data("kendoMobileListView") !=='undefined' )
            {
            	$("#list-edit-listview").data("kendoMobileListView").destroy();
            }
           app.loginService.viewModel.showloder();
           if(typeof e.view.params.parent !== "undefined" && e.view.params.parent !== "0")
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
            //alert('call');
            app.documentsetting.viewModel.setDocuments(data);
            
        });
       
       },
        movedocumentShow:function(e)
        { 
            //console.log(e);
            //alert('callmove');
            app.loginService.viewModel.showloder();
            if(typeof e.view.params.parent !== "undefined")
            {
                parentId = e.view.params.parent;
                app.documentsetting.viewModel.setMoveInnerPage();
                app.documentsetting.viewModel.setmoveDocsId(e.view.params.parent);
                
            }
            else
            {
                parentId = 0;
                app.documentsetting.viewModel.setMoveMainPage();
                app.documentsetting.viewModel.setmoveDocsId(app.documentsetting.viewModel.moveDocsId);
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
            console.log($("#list-edit-listview"));
            console.log($("#list-edit-listview").data("kendoMobileListView"));
            
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
                        hold = true;
                        sessionStorage.currentFId = e.touch.currentTarget.id;
                        sessionStorage.currentFName = e.touch.currentTarget.innerText;
                		
                		navigator.notification.vibrate(20);
                        if(e.touch.initialTouch.className !== 'sharedfolder')
                        {
                			$("#tabstrip-folder-events").data("kendoMobileModalView").open();
                        }
                		$("#tabstrip-folder-events").find(".km-scroll-container").css("-webkit-transform", "");
                		$('.folderName').html('');
                		$('.folderName').append('<span>'+e.touch.currentTarget.innerText+'</span>');
                		$('.folderName').attr("id",e.touch.currentTarget.id)
                	}                    
            });
            $("#list-move-listview").kendoMobileListView({
                dataSource: app.documentsetting.viewModel.documents,
                template: $("#docsmove-template").html(),
                }).kendoTouch({ 
                	filter: ">li",
                	tap: function (e) {    
                		apps.navigate('#tabstrip-movedocs?parent='+e.touch.currentTarget.id);
                	},          	                  
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
        setMoveInnerPage:function()
        {
            var that = this;
            
           
            that.set("moveInnerPage", true);
          
             
        },
        setMoveMainPage:function()
        {
            var that = this;
            
           
            that.set("moveInnerPage", false);
          
             
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
            folderEventsCloseModal();
            
            
            apps.navigate('views/movedocs.html');
        },
        backDocslistPage:function()
        {
            apps.navigate('views/documents.html?parent='+app.documentsetting.viewModel.parentId);
            $("#movePageback").data("kendoMobileBackButton").destroy();
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
        setmoveDocsId:function(id)
        {
            var that = this;
            that.set("moveDocsId", id);
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