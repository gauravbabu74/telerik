(function (global,$) {
    var moveDocumentsViewModel,
        app = global.app = global.app || {};

    moveDocumentsViewModel = kendo.data.ObservableObject.extend({
        documents:[],
        moveDocsId:0,
        moveInnerPage:false,
        checkStatus:'',
        
        movedocumentShow:function(e)
        { 
            if(!window.connectionInfo.checkConnection()){
                navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            		if (confirmed === true || confirmed === 1) {
            			app.movedocumentsetting.viewModel.movedocumentShow(e);
            		}

            	}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                app.movedocumentsetting.viewModel.setCheckStatus(e.view.params.param);
                app.loginService.viewModel.showloder();
                if(typeof $(".list-move-listview").data("kendoMobileListView") !=='undefined' )
                {
                	$(".list-move-listview").data("kendoMobileListView").destroy();
                }
                if(typeof e.view.params.parent !== "undefined")
                {
                    moveParentId = e.view.params.parent;
                    app.movedocumentsetting.viewModel.setmoveDocsId(e.view.params.parent);
                    console.log(backHistory); 
                }
                else
                {   
                    backHistory=[];
                    backHistory.push(0);
                    moveParentId = 0;
                   // setMoveDocsId(0);
                    app.movedocumentsetting.viewModel.setMoveMainPage();
                    app.movedocumentsetting.viewModel.setMoveDocsId(0);
                } 

           	 var dataSource = new kendo.data.DataSource({         
                transport: {
                    read: {
                        url: "https://www.biz2services.com/mobapp/api/folder/",
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: {apiaction:"getlistfilesfolders",userID:localStorage.getItem("userID"),parentID:moveParentId} // search for tweets that contain "html5"
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
                    	app.movedocumentsetting.viewModel.setDocuments(data);
                });
        	}
       },
        moveRefreshView:function(e)
        { 
            if(!window.connectionInfo.checkConnection()){
                navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            		if (confirmed === true || confirmed === 1) {
            			app.movedocumentsetting.viewModel.moveRefreshView(e);
            		}

            	}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                app.loginService.viewModel.showloder();
                if(typeof $(".list-move-listview").data("kendoMobileListView") !=='undefined' )
                {
                	$(".list-move-listview").data("kendoMobileListView").destroy();
                }
           	 var dataSource = new kendo.data.DataSource({         
                transport: {
                    read: {
                        url: "https://www.biz2services.com/mobapp/api/folder/",
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: {apiaction:"getlistfilesfolders",userID:localStorage.getItem("userID"),parentID:app.movedocumentsetting.viewModel.moveDocsId} // search for tweets that contain "html5"
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
                    app.movedocumentsetting.viewModel.setDocuments(data);
                });
            }
       },
        setDocuments: function(data)
        { 
            var that = this;
            that.set("documents", data['0']);
            if(typeof $(".list-move-listview").data("kendoMobileListView") !=='undefined' )
            {
            	$(".list-move-listview").data("kendoMobileListView").destroy();
            }
            $(".list-move-listview").kendoMobileListView({
                dataSource: app.movedocumentsetting.viewModel.documents,
                template: $("#docsmove-template").html(),
                }).kendoTouch({ 
                	filter: ">li",
                	tap: function (e) {
                        if(e.touch.initialTouch.dataset.id === "folder")
                        {
                            if(e.touch.currentTarget.id !== "0")
                            {  
                            	app.movedocumentsetting.viewModel.setMoveInnerPage();
                            	app.movedocumentsetting.viewModel.setMoveDocsId(e.touch.currentTarget.id);
                            }
                            else
                            {
                            	app.movedocumentsetting.viewModel.setMoveMainPage();
                            	app.movedocumentsetting.viewModel.setMoveDocsId(0);
                            } 
                            backHistory.push(e.touch.currentTarget.id);
                            app.movedocumentsetting.viewModel.moveRefreshView();  
                        }
                        
                	},          	                  
            }); 
            app.loginService.viewModel.hideloder();
            $("#tabstrip-movedocs").find(".km-scroll-container").css("-webkit-transform", "");
        },
        setCheckStatus:function(status)
        {
            var that = this;
            that.set("checkStatus", status);  
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
        backDocslistPage:function()
        {  
            apps.navigate('views/documents.html?parent='+app.documentsetting.viewModel.parentId);
        },
        setMoveDocsId:function(id)
        {
            var that = this;
            that.set("moveDocsId", id);
        },
        gobackMovePage:function()
        {

			if(app.movedocumentsetting.viewModel.moveDocsId !== "0")
            {
            	app.movedocumentsetting.viewModel.setMoveInnerPage();
            }
            else
            {
            	app.movedocumentsetting.viewModel.setMoveMainPage();

            }
            if(backHistory[backHistory.length-2] === 0){
               app.movedocumentsetting.viewModel.setMoveMainPage(); 
            }
            app.movedocumentsetting.viewModel.setMoveDocsId(backHistory[backHistory.length-2]);
            backHistory.pop()
            app.movedocumentsetting.viewModel.moveRefreshView(); 
        },
        thisFolderMove:function(e)
        {
            var that = this;
            var status = that.get("checkStatus"); 
        	if(status === 'folder')
            {
                if ( app.documentsetting.viewModel.parentId === app.movedocumentsetting.viewModel.moveDocsId) {
                    navigator.notification.alert("Folder cannot move in same location",
                    function () { }, "Notification", 'OK');

                    return;
                }
                var dataSource = new kendo.data.DataSource({
                    transport: {
                    		read: {
                    		url: "https://www.biz2services.com/mobapp/api/folder",
                    		type:"POST",
                    		dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    		data: {apiaction:"movefolder",userID:localStorage.getItem("userID"),folderID:sessionStorage.getItem("currentFId"),parentID:app.movedocumentsetting.viewModel.moveDocsId}  // search for tweets that contain "html5"
                    }
                },    
                schema: {
                    data: function(data)
                    {   
                    		return [data];
                    }
                },

                });  
            }
            else
            {
                if ( app.documentsetting.viewModel.parentId === app.movedocumentsetting.viewModel.moveDocsId) {
                    navigator.notification.alert("File cannot move in same location",
                    function () { }, "Notification", 'OK');

                    return;
                }
              	var dataSource = new kendo.data.DataSource({
                    transport: {
                    		read: {
                    		url: "https://www.biz2services.com/mobapp/api/file",
                    		type:"POST",
                    		dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    		data: {apiaction:"movefile",userID:localStorage.getItem("userID"),fileID:sessionStorage.getItem("currentFileId"),parentID:app.movedocumentsetting.viewModel.moveDocsId}  // search for tweets that contain "html5"
                    }
                },    
                schema: {
                    data: function(data)
                    {   
                    		return [data];
                    }
                },

                });    
            }
            
            dataSource.fetch(function(){
                var data = dataSource.data(); 
                //console.log(data);
                if(data['0']['results']['faultcode'] === 1)
                {
                    msg =data['0']['results']['faultmsg'];
                    app.loginService.viewModel.mobileNotification(msg,'success');
                }
                else if(data['0']['results']['faultcode'] === 0)
                {
                    msg =data['0']['results']['faultmsg'];
                    app.loginService.viewModel.mobileNotification(msg,'info');  
                }
                else if(data['0']['results']['faultcode'] === 3)
                {
                    msg =data['0']['results']['faultmsg'];
                    app.loginService.viewModel.mobileNotification(msg,'info');  
                }
                else
                {
                    msg ='Some Error Occurred';
                    app.loginService.viewModel.mobileNotification(msg,'warning');  
                    
                }
            });

        	app.documentsetting.viewModel.refreshView();
            app.movedocumentsetting.viewModel.backDocslistPage();           
             
        }
    });
    app.movedocumentsetting = {
        
		viewModel: new moveDocumentsViewModel(),     	
    };
 
})(window,jQuery);