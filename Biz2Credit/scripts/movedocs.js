(function (global,$) {
    var moveDocumentsViewModel,
        app = global.app = global.app || {};

    moveDocumentsViewModel = kendo.data.ObservableObject.extend({
        documents:[],
        moveDocsId:0,
        moveInnerPage:false,
        movedocumentShow:function(e)
        { 
            app.loginService.viewModel.showloder();
            if(typeof $(".list-move-listview").data("kendoMobileListView") !=='undefined' )
            {
            	$(".list-move-listview").data("kendoMobileListView").destroy();
            }
            if(typeof e.view.params.parent !== "undefined")
            {
                moveParentId = e.view.params.parent;
                app.movedocumentsetting.viewModel.setmoveDocsId(e.view.params.parent);
                
            }
            else
            {   
                backHistory=[];
                backHistory.push(0);
                moveParentId = 0;
                app.movedocumentsetting.viewModel.setMoveMainPage();
                app.movedocumentsetting.viewModel.setMoveDocsId(app.movedocumentsetting.viewModel.moveDocsId);
            } 

       	 var dataSource = new kendo.data.DataSource({         
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/folder/",
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
       },
        moveRefreshView:function(e)
        { 
            app.loginService.viewModel.showloder();
            if(typeof $(".list-move-listview").data("kendoMobileListView") !=='undefined' )
            {
            	$(".list-move-listview").data("kendoMobileListView").destroy();
            }
       	 var dataSource = new kendo.data.DataSource({         
            transport: {
                read: {
                    url: "http://biz2services.com/mobapp/api/folder/",
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
       },
        setDocuments: function(data)
        { 
            var that = this;
            that.set("documents", data['0']);  
            $(".list-move-listview").kendoMobileListView({
                dataSource: app.movedocumentsetting.viewModel.documents,
                template: $("#docsmove-template").html(),
                }).kendoTouch({ 
                	filter: ">li",
                	tap: function (e) {
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
                	},          	                  
            }); 
            app.loginService.viewModel.hideloder();
            $("#tabstrip-movedocs").find(".km-scroll-container").css("-webkit-transform", "");
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
        }
    });
    app.movedocumentsetting = {
        
		viewModel: new moveDocumentsViewModel(),     	
    };
 
})(window,jQuery);