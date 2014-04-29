(function (global,$) {
    var fileExportViewModel,
        app = global.app = global.app || {};

    fileExportViewModel = kendo.data.ObservableObject.extend({
        expDocs:[],
        exportInnerPage:false,
        filedocumentShow:function(e)
        {
            app.fileexportsetting.viewModel.getFileSystem();
        },
        getFileSystem:function()
        {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function(fileSystem){ // success get file system
               	 root = fileSystem.root;
                    
                	app.fileexportsetting.viewModel.listDir(root);
                    
                }, 
                function(evt){ // error get file system
                	console.log("File System Error: "+evt.target.error.code);
                }
            );		
        },
        getActiveItem:function(name)
        {   
            activeItem ='';
            if(currentDir !== null ){
                currentDir.getDirectory(name, {create:false},
                    function(dir){ // success find directory
                    	activeItem = dir;
                        app.fileexportsetting.viewModel.listDir(activeItem);
                    }, 
                    function(error){ // error find directory
                    	console.log('Unable to find directory: '+error.code);
                    }
                );
            }
 
        },

        listDir:function(directoryEntry){
            if(typeof $("#dirContent").data("kendoMobileListView") !=='undefined')
            {
            	$("#dirContent").data("kendoMobileListView").destroy();
            
            }
            app.loginService.viewModel.showloder(); // show loading message
			
            currentDir = directoryEntry; // set current directory
            directoryEntry.getParent(function(par){ // success get parent
            parentDir = par; // set parent directory
            	if( (parentDir.name === 'sdcard' && currentDir.name !== 'sdcard') || parentDir.name !== 'sdcard' ) $('#backBtn').show();
            	}, function(error){ // error get parent
            		console.log('Get parent error: '+error.code);
            	});

            var directoryReader = directoryEntry.createReader();
            directoryReader.readEntries(function(entries){
            var dirContent = $('#dirContent');
            dirContent.empty();

            var dirArr = new Array();
            for(var i=0; i<entries.length; ++i){ // sort entries
            	var entry = entries[i];
            	if( entry.isDirectory && entry.name[0] !== '.' ) dirArr.push(entry);
            }
            app.fileexportsetting.viewModel.setExportDocs(dirArr);
            app.loginService.viewModel.hideloder(); // hide loading message
            }, function(error){
            	console.log('listDir readEntries error: '+error.code);

            });
        },
        setExportDocs:function(data)
        {
            console.log(data);
            var that = this;
            that.set("expDocs", data);
             $("#dirContent").kendoMobileListView({
                dataSource: app.fileexportsetting.viewModel.expDocs,
                template: $("#docs-export-template").html(),
                }).kendoTouch({ 
                	filter: ">li",
                  	tap: function (e) { 
						app.fileexportsetting.viewModel.setExportInnerPage();
						app.fileexportsetting.viewModel.getActiveItem(e.touch.initialTouch.innerText);
                	},
                
            });
        },
        backDocslistPage:function(e)
        {
            
        },
        gobackFileExportPage:function(e)
        {
            
        },
        
        thisFileExport:function(e)
        {
            
        },
        setExportInnerPage:function()
        {
            var that = this;
            that.set("exportInnerPage", true);  
        },
        setExportRootPage:function()
        {
            var that = this;
            that.set("exportInnerPage", false);  
        }
    });
    app.fileexportsetting = {
        
		viewModel: new fileExportViewModel(),     	
    };
 
})(window,jQuery);