(function (global,$) {
    var fileExportViewModel,
        app = global.app = global.app || {};

    fileExportViewModel = kendo.data.ObservableObject.extend({
        
        root:null, // File System root variable
        currentDir:null, // Current DirectoryEntry listed
        parentDir :null,
        exportInnerPage:'',
        
        filedocumentShow:function(e)
        {
            app.fileexportsetting.viewModel.getFileSystem();
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
        listDir:function(directoryEntry){
            
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
         


         
        for(var i=0; i<dirArr.length; ++i)
        { 
            var entry = dirArr[i];
			html = '';
            if( entry.isDirectory )
            {
                alert(entry.name);
             html += "<li>"+entry.name+"</li>";
            }
        }
        $("#dirContent").append(html);
       app.loginService.viewModel.hideloder(); // hide loading message
    }, function(error){
        console.log('listDir readEntries error: '+error.code);
    });
}
        
    });
    app.fileexportsetting = {
        
		viewModel: new fileExportViewModel(),     	
    };
 
})(window,jQuery);