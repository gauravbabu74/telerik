(function(cordova) {

	function FtpClient() {}

	FtpClient.prototype.saveFileDataToLibrary = function(successCallback, failureCallback, userInfo) {
		
        console.log(userInfo);
        
		return cordova.exec(successCallback, failureCallback, "FtpClient","saveFileDataToLibrary",userInfo);
	};

	cordova.addConstructor(function() {
		window.plugins = window.plugins || {};
		window.plugins.ftpclient = new FtpClient();
	});
    
    
    
    
   
})(window.cordova || window.Cordova);