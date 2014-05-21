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
        renameFileName:'',
        fileExt:'',
        documentShow:function(e)
        { 
            if(!window.connectionInfo.checkConnection()){
            	navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
        			if (confirmed === true || confirmed === 1) {
        				app.documentsetting.viewModel.documentShow(e);
        			}

        		}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                app.loginService.viewModel.showloder();
                if(typeof $(".list-edit-listview").data("kendoMobileListView") !=='undefined')
                {
                	$(".list-edit-listview").data("kendoMobileListView").destroy();
                    //$(".list-edit-listview").unwrap();
                }
                if(typeof e.view.params.parent !== "undefined" && e.view.params.parent !== "0")
                {
                    parentId = e.view.params.parent;
                    app.documentsetting.viewModel.setInnerPage();
                    app.documentsetting.viewModel.setParentId(e.view.params.parent);
                    
                }
                else
                {
                    docsBackHistory=[];
                    docsBackHistory.push(0);
                    parentId = 0;
                    app.documentsetting.viewModel.setMainPage();
                    app.documentsetting.viewModel.setParentId(0);
                }   

           	 var dataSource = new kendo.data.DataSource({         
                transport: {
                    read: {
                        url: "https://www.biz2services.com/mobapp/api/folder/",
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
       	 }
       },
       refreshView:function(e)
        {
            if(!window.connectionInfo.checkConnection()){
            	navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            		if (confirmed === true || confirmed === 1) {
            			app.documentsetting.viewModel.refreshView(e);
            		}

            	}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                if( app.documentsetting.viewModel.parentId === 0)
                {
                    parentId = 0;
                    app.documentsetting.viewModel.setMainPage();
                }
                else
                {
                    parentId =  app.documentsetting.viewModel.parentId;
                    app.documentsetting.viewModel.setInnerPage();
                }
                if(typeof $(".list-edit-listview").data("kendoMobileListView") !=='undefined' )
                {
                	$(".list-edit-listview").data("kendoMobileListView").destroy();
                }
                var that = this;
                that.set("showrefreshLoading", true);
           	 var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "https://www.biz2services.com/mobapp/api/folder/",
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
            }
        },
        setDocuments: function(data)
        { 
            var that = this;
            that.set("documents", data['0']); 
            if(typeof $(".list-edit-listview").data("kendoMobileListView") !=='undefined')
            {
            	$(".list-edit-listview").data("kendoMobileListView").destroy();
            	//$(".list-edit-listview").unwrap();
            }
            $(".list-edit-listview").kendoMobileListView({
                dataSource: app.documentsetting.viewModel.documents,
                template: $("#docs-template").html(),
                filterable: {
                field: "name",
                operator: "startswith",
                },
                }).kendoTouch({ 
                	filter: ">li",
                  	tap: function (e) { 
                      // e.touch.currentTarget.className='km-state-active';  
                       if(e.touch.initialTouch.dataset.id === "folder")
                        { 
                            //hold = false;
                    		if(!hold)
                    		{
                                if(e.touch.currentTarget.id !== "0")
                                {  
                                	app.documentsetting.viewModel.setInnerPage();
                                	app.documentsetting.viewModel.setParentId(e.touch.currentTarget.id);
                                }
                                else
                                {
                                	app.movedocumentsetting.viewModel.setMainPage();
                                	app.movedocumentsetting.viewModel.setParentId(0);
                                } 
                            	docsBackHistory.push(e.touch.currentTarget.id);
                            	app.documentsetting.viewModel.refreshView();
                                
                   		 }
                        }
                        else if(e.touch.initialTouch.dataset.id === "files")
                        {
                            if(!hold)
                    		{
                                sessionStorage.currentFileId = e.touch.currentTarget.id;
                                sessionStorage.currentFileName = e.touch.currentTarget.innerText;
                                fileName = $.trim(e.touch.currentTarget.innerText);
                                serverFileName = $.trim(sessionStorage.currentFileId)+'.file';
                                userinfo = [];
                                
                                userinfo.push(localStorage.getItem("ftpHost"));
                                userinfo.push(localStorage.getItem("ftpPassword"));
                                userinfo.push(localStorage.getItem("ftpPath"));
                                userinfo.push(localStorage.getItem("ftpRelativePath"));
                                userinfo.push(localStorage.getItem("ftpUserName"));
                                userinfo.push(serverFileName);
                                userinfo.push(fileName);
                                userinfo.push("biz2docs");
                                folderName = "biz2docs";
                                app.documentsetting.viewModel.downloadFile(userinfo,folderName);
                                }
                        }
                	}, 
                	touchstart: function (e) {
                		hold = false;
                        
               	 },
                	hold: function (e) {
                        hold = true;
                        
                        
                        navigator.notification.vibrate(20);
						if(e.touch.initialTouch.dataset.id === "folder")
                        {
                            sessionStorage.currentFId = e.touch.currentTarget.id;
                        	sessionStorage.currentFName = e.touch.currentTarget.innerText;
                            if(e.touch.initialTouch.innerText !== "Shared Files" && e.touch.initialTouch.innerText !== "Shared Folders")
                            {
                                
                    			$("#tabstrip-folder-events").data("kendoMobileModalView").open();
                                $("#tabstrip-folder-events").find(".km-scroll-container").css("-webkit-transform", "");
                    			$('.folderName').html('');
                    			if(e.touch.currentTarget.innerText.length >= 20)
                                {
                                   $('.folderName').append('<span>'+e.touch.currentTarget.innerText.substring(0, 20)+'...</span>'); 
                                }
                                else
                                {
                                    $('.folderName').append('<span>'+e.touch.currentTarget.innerText+'</span>');
                                }
                    			$('.folderName').attr("id",e.touch.currentTarget.id)
                            }
                        }
                        else if(e.touch.initialTouch.dataset.id === "files")
                        {
                                sessionStorage.currentFileId = e.touch.currentTarget.id;
                                sessionStorage.currentFileName = e.touch.currentTarget.innerText;
                                if (device.platform === "Android") {
                            		$("#tabstrip-files-events").data("kendoMobileModalView").open();
                                	$("#tabstrip-files-events").find(".km-scroll-container").css("-webkit-transform", "");
                                }
                            	else
                            	{
                                    $("#tabstrip-files-events-ios").data("kendoMobileModalView").open();
                                	$("#tabstrip-files-events-ios").find(".km-scroll-container").css("-webkit-transform", "");
                                }
                            	$('.folderName').html('');
                                if(e.touch.currentTarget.innerText.length >= 20)
                                {
                                   $('.folderName').append('<span>'+e.touch.currentTarget.innerText.substring(0, 20)+'...</span>'); 
                                }
                                else
                                {
                                    $('.folderName').append('<span>'+e.touch.currentTarget.innerText+'</span>');
                                }
                                
                        }
                		e.touch.currentTarget.className='';
                	}                    
            });
            $("#tabstrip-docs").find(".km-scroll-container").css("-webkit-transform", "");
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
            if(app.documentsetting.viewModel.parentId === 0)
            {
                 $(".list-edit-listview").html("");
            }
            that.set("innerPage", true); 
        },
        setMainPage:function()
        {
            var that = this;
            if(app.documentsetting.viewModel.parentId !== 0)
            {
                 $(".list-edit-listview").html("");
            }
            that.set("innerPage", false);  
        },

        
        deleteFolder:function(e)
        { 
             closeModalView(e);
             $("#tabstrip-delete-folder").data("kendoMobileModalView").open();
        },
        thisFolderDelete:function(e)
        {
            if(!window.connectionInfo.checkConnection()){
            	navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            		if (confirmed === true || confirmed === 1) {
            			app.documentsetting.viewModel.thisFolderDelete(e);
            		}

            	}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
    		    var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "https://www.biz2services.com/mobapp/api/folder",
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: {apiaction:"deletefolder",userID:localStorage.getItem("userID"),folderID:sessionStorage.getItem("currentFId")}  // search for tweets that contain "html5"
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

                    if(data['0']['results']['faultcode'] === 1)
                    {
                        msg ="Folder Deleted Successfully.";
                        app.loginService.viewModel.mobileNotification(msg,'success');
                    }
                    else if(data['0']['results']['faultcode'] === 0)
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
          	  closeModalView(e);
                app.documentsetting.viewModel.refreshView(); 
            }
        },
        deleteFile:function(e)
        {
           closeModalView(e);
           $("#tabstrip-delete-files").data("kendoMobileModalView").open();
        } ,
        thisFileDelete:function(e)
        {
            if(!window.connectionInfo.checkConnection()){
            	navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            		if (confirmed === true || confirmed === 1) {
            			app.documentsetting.viewModel.thisFileDelete(e);
            		}

            	}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "https://www.biz2services.com/mobapp/api/file",
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: {apiaction:"deletefile",userID:localStorage.getItem("userID"),fileID:sessionStorage.getItem("currentFileId")}  // search for tweets that contain "html5"
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

                    if(data['0']['results']['faultcode'] === 1)
                    {
                        msg ="File Deleted Successfully.";
                        app.loginService.viewModel.mobileNotification(msg,'success');
                    }
                    else if(data['0']['results']['faultcode'] === 0)
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
          	  closeModalView(e);
                app.documentsetting.viewModel.refreshView();
			}
        },
       
        renameFolder:function(e)
        {
            closeModalView(e);
            var that = this;
            that.set("renameFolderName",$.trim(sessionStorage.getItem("currentFName")));
            $("#tabstrip-rename-folder .new-folder-field").val(that.get("renameFolderName"));
            $("#tabstrip-rename-folder").data("kendoMobileModalView").open();
        },
        thisFolderRenameCancle:function(e)
        {
            var that = this;
            that.set("renameFolderName","");
            $("#tabstrip-rename-folder").data("kendoMobileModalView").close();  
        },
        thisFolderRename:function(e)
        {
            if(!window.connectionInfo.checkConnection()){
            	navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            		if (confirmed === true || confirmed === 1) {
            			app.documentsetting.viewModel.thisFolderRename(e);
            		}

            	}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                var that = this;
                var renameFolder = that.get("renameFolderName");
                if (renameFolder === "") {
                    navigator.notification.alert("Please enter folder name",
                    function () { }, "Notification", 'OK');

                    return;
                }
                if (renameFolder.length > 255) {
                    navigator.notification.alert("Folder name should be less than 255 chracters",
                    function () { }, "Notification", 'OK');

                    return;
                }
    		    var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "https://www.biz2services.com/mobapp/api/folder",
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
                    else
                    {
                        msg ='Some Error Occurred';
                        app.loginService.viewModel.mobileNotification(msg,'warning');  
                        
                    }
                }); 
          	  closeModalView(e);
                app.documentsetting.viewModel.refreshView(); 
            }
            
        },
        renameFile:function(e)
        {
            closeModalView(e);
            var that = this;
            that.set("fileExt",$.trim(that.getFileExtension(sessionStorage.getItem("currentFileName"))));
            var fileNameWithoutExt= sessionStorage.getItem("currentFileName").substr(0, sessionStorage.getItem("currentFileName").lastIndexOf('.'));
            that.set("renameFileName",fileNameWithoutExt);
            $("#tabstrip-rename-file .new-folder-field").val(that.get("renameFileName"));
            $("#tabstrip-rename-file").data("kendoMobileModalView").open(); 
        },
        
        thisFileRenameCancle:function(e)
        {
            var that = this;
            that.set("renameFileName","");
            $("#tabstrip-rename-file").data("kendoMobileModalView").close();  
        },
        thisFileRename:function(e)
        {
            if(!window.connectionInfo.checkConnection()){
            	navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            		if (confirmed === true || confirmed === 1) {
            			app.documentsetting.viewModel.thisFileRename(e);
            		}

            	}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                var that = this;
                var renameFile = that.get("renameFileName");
                if(that.get("fileExt") === '.' || that.get("fileExt") === '')
                {
					renameFileExt = ''; 
                }
                else
                {
    				renameFileExt = '.'+that.get("fileExt");
                }
                if (renameFile === "") {
                    navigator.notification.alert("Please enter file name",
                    function () { }, "Notification", 'OK');

                    return;
                }
                if (renameFile.length > 255) {
                    navigator.notification.alert("File name should be less than 255 chracters",
                    function () { }, "Notification", 'OK');

                    return;
                }
                
    		    var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "https://www.biz2services.com/mobapp/api/file",
                        type:"POST",
                        dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                        data: {apiaction:"renamefile",userID:localStorage.getItem("userID"),fileID:sessionStorage.getItem("currentFileId"),fileName:renameFile+renameFileExt,parentID:parentId}  // search for tweets that contain "html5"
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
                    else
                    {
                        msg ='Some Error Occurred';
                        app.loginService.viewModel.mobileNotification(msg,'warning');  
                        
                    }
                }); 
          	  closeModalView(e);
                app.documentsetting.viewModel.refreshView();
            }
        },
        exportFile:function(e)
        {	
             closeModalView(e);
             apps.navigate('views/fileExport.html');
        },
        moveFolder:function(e)
        {
            closeModalView(e);
            var params = e.button.data();
            apps.navigate('views/movedocs.html?param='+params.checkstatus);
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
            var that = this;
            that.set("newFolderName", "");
            $("#tabstrip-new-folder").data("kendoMobileModalView").open();  
        },
        newFolderCreate:function(e)
        {
            if(!window.connectionInfo.checkConnection()){
            	navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            		if (confirmed === true || confirmed === 1) {
            			app.documentsetting.viewModel.newFolderCreate(e);
            		}

            	}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            {
                var that = this;
                newFolderName = that.get("newFolderName");
                if (newFolderName === "") {
                    navigator.notification.alert("Please enter folder name",
                    function () { }, "Notification", 'OK');

                    return;
                }
                if (newFolderName.length > 255) {
                    navigator.notification.alert("Folder name should be less than 255 chracters",
                    function () { }, "Notification", 'OK');

                    return;
                }
                var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "https://www.biz2services.com/mobapp/api/folder",
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

                    if(data['0']['results']['faultcode'] === 1)
                    {
                        msg ="New Folder Created";
                        app.loginService.viewModel.mobileNotification(msg,'success');
                    }
                    else if(data['0']['results']['faultcode'] === 0)
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
                closeModalView(e);
                that.get("newFolderName","");
                app.documentsetting.viewModel.refreshView();
            }
        },
        setUserLogout:function()
        {
            app.loginService.viewModel.setUserLogout();
        },
        gobackDocsPage:function()
        {
            var that = this;
            if(!that.get("showrefreshLoading")){
                if(app.documentsetting.viewModel.parentId !== "0")
                {
                	app.documentsetting.viewModel.setInnerPage();
                }
                else
                {
                	app.documentsetting.viewModel.setMainPage();

                }
                if(docsBackHistory[docsBackHistory.length-2] === 0){
                	app.documentsetting.viewModel.setMainPage(); 
                }
                app.documentsetting.viewModel.setParentId(docsBackHistory[docsBackHistory.length-2]);
                docsBackHistory.pop();
                app.documentsetting.viewModel.refreshView();
            }
             
        },
        getFilesystem:function (success, fail) {
        	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
       	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
        },

        getFolder: function (fileSystem, folderName, success, fail) {
        	fileSystem.root.getDirectory(folderName, {create: true, exclusive: false}, success, fail)
        },
        downloadFile:function(userinfo,folderName)
        {
		    filePath = "";

            	app.documentsetting.viewModel.getFilesystem(
            		function(fileSystem) {
            			
            			if (device.platform === "Android") {
            				app.documentsetting.viewModel.getFolder(fileSystem, folderName, function(folder) {
            					filePath = folder.fullPath + "\/" + fileName;
                                relPath = folder.name + "\/" + fileName;
                                //relPath =fileName;
                                fileSystem.root.getFile(relPath, { create: false }, app.documentsetting.viewModel.fileExists, app.documentsetting.viewModel.fileDoesNotExist);
                                
            				}, function() {
            					console.log("Failed to get folder");
            				});
            			}
            			else {
            				filePath = fileSystem.root.fullPath + "\/" +"biz2docs\/" +fileName;
                            fileSystem.root.getFile(filePath, { create: false }, app.documentsetting.viewModel.fileExists, app.documentsetting.viewModel.fileDoesNotExist);
            				
            			}
            		},
            		function() {
            			alert("Failed to get filesystem");
            		}
            		);
           
        },
        fileExists:function(fileEntry)
        {
            if(device.platform.toLowerCase() === "ios" )
            {
                window.open(encodeURI(fileEntry.fullPath),"_blank","location=yes,hidden=no");
            }
            else
            {
                window.open(encodeURI(fileEntry.fullPath),"_system","location=yes,hidden=no");
            }
             
        },
        fileDoesNotExist:function(fileError)
        {
            fileName = sessionStorage.getItem("currentFileName");
            ext = app.documentsetting.viewModel.getFileExtension(fileName);
            $("#tabstrip-download-file").data("kendoMobileModalView").open();
            var ftpclient = window.plugins.ftpclient;
            if (device.platform === "Android") {
                ftpclient.Connect(
                function(msg){
                    ftpclient.downloadFile(
                        function(downmsg){
                        	$("#tabstrip-download-file").data("kendoMobileModalView").close();
                            window.open(encodeURI(filePath),"_system","location=yes,hidden=no");
                            /*app.loginService.viewModel.mobileNotification(downmsg,'success');
                                ftpclient.Disconnect(
                                    function(downmsg){	
                                    }, 
                                    function(downerr){
                                    }, 
                                    userinfo
                                );*/
                        }, 
                        function(downerr){
                        	$("#tabstrip-download-file").data("kendoMobileModalView").close();
                        	navigator.notification.alert(downerr);
                            ftpclient.Disconnect(
                                    function(downmsg){	
                                    }, 
                                    function(downerr){
                                    }, 
                                    userinfo
                                );

                        }, 
                        userinfo
                    );
                }, 
                function(err){
                	$("#tabstrip-download-file").data("kendoMobileModalView").close();
                	navigator.notification.alert("Connection to Server Failed");

                }, 
                userinfo
                );
            }
            else {
                ftpclient.downloadFile(
                function(downmsg){
                	$("#tabstrip-download-file").data("kendoMobileModalView").close();
                    window.open(encodeURI(filePath),"_blank","location=yes,hidden=no");
                }, 
                function(downerr){
                	$("#tabstrip-download-file").data("kendoMobileModalView").close();
                	navigator.notification.alert(downerr);

                }, 
                userinfo
                );
            	
            }
            
            $('.download-file-name').html('');
        	$('.download-file-name').append('<div class="unkown '+ext+'">'+fileName+'</div>');
                                
        },
        transferFile: function (uri, filePath) {
            transfer = new FileTransfer();
            transfer.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                   
                	var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                	$('#status').innerHTML = perc + "% loaded...";
                } else {
                	if($('#status').innerHTML === "") {
                       
                		$('#status').innerHTML = "Loading";
                	} else {
                        
                		$('#status').innerHTML += ".";
                	}
                }
            };
            transfer.download(
                uri,
                filePath,
                function(fileEntry) { 
                    $("#tabstrip-download-file").data("kendoMobileModalView").close();
                    if(device.platform.toLowerCase() === "ios" )
            		{
                		window.open(encodeURI(fileEntry.fullPath),"_blank","location=yes,hidden=no");
            		}
            		else
            		{
                		window.open(encodeURI(fileEntry.fullPath),"_system","location=yes,hidden=no");
            		}	
                },
                function(error) {
                    app.documentsetting.viewModel.getFilesystem(
                		function(fileSystem) {
                			fileSystem.root.getFile(filePath, {create: false,exclusive:true},  app.documentsetting.viewModel.gotRemoveFileEntry, alert("Download error code" + error.target));
                		},
                		function() {
                			console.log("failed to get filesystem");
                		}
            		);
                    
                }
            );
            
        },
        gotRemoveFileEntry:function(fileEntry)
        {
          fileEntry.remove(function() {
                			console.log("File is removed from filesystem");
                		}, function() {
                			console.log("File is not removed from filesystem");
                		});  
        },
        transferFileAbort:function()
        {
           
            var disFtpclient = window.plugins.ftpclient;
            disFtpclient.Disconnect(
                function(downmsg){
                	$("#tabstrip-download-file").data("kendoMobileModalView").close();
                    //navigator.notification.alert(downmsg);
                }, 
                function(downerr){
                	$("#tabstrip-download-file").data("kendoMobileModalView").close();
                  // navigator.notification.alert(downerr);
                    
                }, 
                userinfo
                );
            	
        },
        getFileExtension:function(filename)
        {
            var ext = /^.+\.([^.]+)$/.exec(filename);
            return ext === null ? "" : ext[1];
        },
        closeFileDownloadProcess:function()
        {
           
           $("#tabstrip-download-file").data("kendoMobileModalView").close();
           //app.documentsetting.viewModel.transferFileAbort();
            navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
				if (confirmed === true || confirmed === 1) {
               	$("#tabstrip-download-file").data("kendoMobileModalView").close();
            	   app.documentsetting.viewModel.transferFileAbort();
            	}
                
        	}, 'exit', 'Ok,Cancel');

        },
        onSettingPage:function()
        {
             app.loginService.viewModel.onSettingPage();
        }
       
        
    });
    app.documentsetting = {
        
		viewModel: new DocumentsViewModel(),     	
    };
 
})(window,jQuery);