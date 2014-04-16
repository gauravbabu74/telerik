(function (global,$) {
    var DocumentsViewModel,
        app = global.app = global.app || {};

    DocumentsViewModel = kendo.data.ObservableObject.extend({
        documents:[],
        showfilter:false,
        innerPage:false,
        parentPage:'',
        currentFolderId:0,
        showrefreshLoading:false,
        listViewInit:function(e) {
                e.view.element.find("#list-edit-listview").kendoTouch({ 
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
					 navigator.notification.vibrate(100);
                     $("#tabstrip-folder-events").data("kendoMobileModalView").open();
            		 $("#tabstrip-folder-events").find(".km-scroll-container").css("-webkit-transform", "");
                     $('#tabstrip-folder-events .folderName').html('');
                     $('#tabstrip-folder-events .folderName').append('<span>'+e.touch.currentTarget.innerText+'</span>');
                     $('#tabstrip-folder-events .folderName').attr("id",e.touch.currentTarget.id)
                    }                    
            });
        },
		documentShow:function(e)
        { 
            app.loginService.viewModel.showloder();
            if(typeof e.view.params.parent !== "undefined")
            {
                var parentId = e.view.params.parent;
                app.documentsetting.viewModel.setInnerPage();
                app.documentsetting.viewModel.setcurrentFolderId(e.view.params.parent);
                
            }
            else
            {
                var parentId = 0;
                app.documentsetting.viewModel.setMainPage();
                app.documentsetting.viewModel.setcurrentFolderId(0);
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
                        //console.log(data);
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
        
        refreshView:function(e)
        {
           //app.loginService.viewModel.showloder();
            //console.log(app.documentsetting.viewModel.currentFolderId);
             if( app.documentsetting.viewModel.currentFolderId === 0)
            {
                var parentId = 0;
                
                
            }
            else
            {
                var parentId =  app.documentsetting.viewModel.currentFolderId;
                
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
                        //console.log(data);
                    }
                	return [docsArray];
                }
            },
     
        });
             
        dataSource.fetch(function(){
            var data = dataSource.view();
            //console.log(dataSource);
            app.documentsetting.viewModel.setDocuments(data);
            app.documentsetting.viewModel.hideRefreshLoading();
            
        });
           
        },
        deleteFolder:function(e)
        {
            alert('delete call');
        },
        renameFolder:function(e)
        {
            alert('rename call');
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
        setcurrentFolderId:function(id)
        {
            var that = this;
            that.set("currentFolderId", id);
        }
    });
    app.documentsetting = {
        
		viewModel: new DocumentsViewModel(),     	
    };
 
})(window,jQuery);
