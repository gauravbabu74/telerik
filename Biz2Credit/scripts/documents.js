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
        documentShow:function(e)
        { 
            app.loginService.viewModel.showloder();
            if(typeof $("#list-edit-listview").data("kendoMobileListView") !=='undefined')
            {
            	$("#list-edit-listview").data("kendoMobileListView").destroy();
                //$("#list-edit-listview").unwrap();
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
       refreshView:function(e)
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
            if(typeof $("#list-edit-listview").data("kendoMobileListView") !=='undefined' )
            {
            	$("#list-edit-listview").data("kendoMobileListView").destroy();
                //$("#list-edit-listview").unwrap();
            }
            //app.loginService.viewModel.showloder();
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
        setDocuments: function(data)
        { 
            var that = this;
            that.set("documents", data['0']);  
            console.log( data['0']);
            $("#list-edit-listview").kendoMobileListView({
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
                            alert('tap');
                            fileName = "test.png",
                            uri = encodeURI("http://www.telerik.com/sfimages/default-source/logos/app_builder.png"),
                            folderName = "bizdocs";
                            app.documentsetting.viewModel.downloadFile(uri, fileName, folderName);
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
						if(e.touch.initialTouch.dataset.id === "folder")
                        {
                            if(e.touch.initialTouch.innerText !== "Shared Files" && e.touch.initialTouch.innerText !== "Shared Folders")
                            {
                                
                    			$("#tabstrip-folder-events").data("kendoMobileModalView").open();
                                $("#tabstrip-folder-events").find(".km-scroll-container").css("-webkit-transform", "");
                    			$('.folderName').html('');
                    			$('.folderName').append('<span>'+e.touch.currentTarget.innerText+'</span>');
                    			$('.folderName').attr("id",e.touch.currentTarget.id)
                            }
                        }
                        else if(e.touch.initialTouch.dataset.id === "files")
                        {
                            //console.log( $("#tabstrip-files-events").data("kendoMobileModalView"));
                            //console.log( $("#tabstrip-files-events").data("kendoMobileModalView"));
                             //$("#tabstrip-files-events").data("kendoMobileModalView").scrollerContent['0'].scrollHeight;
                             $("#tabstrip-files-events").data("kendoMobileModalView").open();
                             $("#tabstrip-files-events").find(".km-scroll-container").css("-webkit-transform", "");
                        }
                		//e.touch.currentTarget.className='';
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
                 $("#list-edit-listview").html("");
            }
            that.set("innerPage", true); 
        },
        setMainPage:function()
        {
            var that = this;
            if(app.documentsetting.viewModel.parentId !== 0)
            {
                 $("#list-edit-listview").html("");
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
            alert('pending delete webservices');
            closeModalView(e);
             //$("#tabstrip-delete-folder").data("kendoMobileModalView").open();
        },
        deleteFile:function(e)
        {
           closeModalView(e);
           $("#tabstrip-delete-files").data("kendoMobileModalView").open();
        } ,
        thisFileDelete:function(e)
        {
            alert('pending delete webservices');
            closeModalView(e);
             //$("#tabstrip-delete-folder").data("kendoMobileModalView").open();
        },
       
        renameFolder:function(e)
        {
             closeModalView(e);
             $("#tabstrip-rename-folder").data("kendoMobileModalView").open();
        },
        thisFolderRename:function(e)
        {
            /*var that = this;
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
            }); */
          alert('rename call');
      	closeModalView(e);
          app.documentsetting.viewModel.refreshView(); 
            
        },
        renameFile:function(e)
        {
           closeModalView(e);
             $("#tabstrip-rename-file").data("kendoMobileModalView").open(); 
        },
        thisFileRename:function(e)
        {
            
            alert('rename file call');
            closeModalView(e);
        },
        moveFolder:function(e)
        {
            closeModalView(e);

            apps.navigate('views/movedocs.html');
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
        newFolderCreate:function(e)
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
            closeModalView(e);
            app.documentsetting.viewModel.refreshView(); 
        },
        setUserLogout:function()
        {
            app.loginService.viewModel.setUserLogout();
        },
        gobackDocsPage:function()
        {
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
            docsBackHistory.pop()
            app.documentsetting.viewModel.refreshView(); 
        },
        getFilesystem:function (success, fail) {
        	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
       	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
        },

        getFolder: function (fileSystem, folderName, success, fail) {
        	fileSystem.root.getDirectory(folderName, {create: true, exclusive: false}, success, fail)
        },
        downloadFile:function(uri, fileName, folderName)
        {
            var that = this,
		    filePath = "";
        
           
            	app.documentsetting.viewModel.getFilesystem(
            		function(fileSystem) {
            			console.log("gotFS");
                        
            			if (device.platform === "Android") {
            				app.documentsetting.viewModel.getFolder(fileSystem, folderName, function(folder) {
            					filePath = folder.fullPath + "\/" + fileName;
            					that.transferFile(uri, filePath)
            				}, function() {
            					console.log("failed to get folder");
            				});
            			}
            			else {
            				filePath = fileSystem.root.fullPath + "\/" + fileName;
            				app.documentsetting.viewModel.transferFile(uri, filePath)
            			}
            		},
            		function() {
            			console.log("failed to get filesystem");
            		}
            		);
           
        },
        transferFile: function (uri, filePath) {
            var transfer = new FileTransfer();
            transfer.download(
                uri,
                filePath,
                function(entry) {
                    //var image = document.getElementById("downloadedImage");
                   // image.src = entry.fullPath;
                   // image.style.display = "block"
                    //image.display = entry.fullPath;
                    //document.getElementById("result").innerHTML = "File saved to: " + entry.fullPath;;
                    console.log("download complete: " + entry.fullPath);
                },
                function(error) {
                    //document.getElementById("result").innerHTML = "An error has occurred: Code = " + error.code;
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("upload error code" + error.code);
                }
            );
        },
        
    });
    app.documentsetting = {
        
		viewModel: new DocumentsViewModel(),     	
    };
 
})(window,jQuery);