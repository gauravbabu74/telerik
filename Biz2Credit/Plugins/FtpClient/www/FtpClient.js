(function(cordova) {

	function FtpClient() {}
/*
        FtpClient.prototype.put = function(file, url, successCallback, errorCallback) {
           // console.log(file);
           // console.log(url);
           // return 'aaa';
             return cordova.exec(successCallback, errorCallback, "FtpClient", "put", [file, url]);
        };

       
        FtpClient.prototype.get = function(file, url, successCallback, errorCallback) {
            console.log(file);
            console.log(url);
           // return 'aaa';
             return cordova.exec(successCallback, errorCallback, "FtpClient", "get", [file, url]);
        };
*/
	FtpClient.prototype.saveFileDataToLibrary = function(successCallback, failureCallback, userInfo) {
		// successCallback required
		//if (typeof successCallback !== "function") {
		//	console.log("Canvas2ImagePlugin Error: successCallback is not a function");
		//	return;
		//}
		//if (typeof failureCallback !== "function") {
		//	console.log("Canvas2ImagePlugin Error: failureCallback is not a function");
		///	return;
		//}
		//var canvas = document.getElementById('myCanvas');
        //console.log(canvas);
		//var imageData = canvas.toDataURL().replace(/data:image\/png;base64,/,'');
        console.log([userInfo]);
        //console.log(cordova.exec(successCallback, failureCallback, "Canvas2ImagePlugin","saveImageDataToLibrary",[imageData]));
		return cordova.exec(successCallback, failureCallback, "FtpClient","saveFileDataToLibrary",userInfo);
	};

	cordova.addConstructor(function() {
		window.plugins = window.plugins || {};
		window.plugins.ftpclient = new FtpClient();
	});
    
    
    
    
   
})(window.cordova || window.Cordova);