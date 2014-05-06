(function(cordova) {

	function FtpClient() {}

        FtpClient.prototype.put = function(file, url, successCallback, errorCallback) {
            console.log(file);
            console.log(url);
             return cordova.exec(successCallback, errorCallback, "FtpClient", "put", [file, url]);
        };

        /**
        * Download a file from a FTP server
        *
        * @param file The file to be uploaded to the server
        * @param url The url of the ftp server
        * @param successCallback The success callback
        * @param errorCallback The error callback
        */
        FtpClient.prototype.get = function(file, url, successCallback, errorCallback) {
             return cordova.exec(successCallback, errorCallback, "FtpClient", "get", [file, url]);
        };


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
		return cordova.exec(successCallback, failureCallback, "Ftpclient","saveFileDataToLibrary",userInfo);
	};

	cordova.addConstructor(function() {
		window.plugins = window.plugins || {};
		window.plugins.ftpclient = new FtpClient();
	});
    
    
    
    
   
})(window.cordova || window.Cordova);