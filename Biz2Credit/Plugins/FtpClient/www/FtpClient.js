
(function(cordova) {

	function FtpClient() {}

	FtpClient.prototype.Connect = function(successCallback, failureCallback, userInfo) {
        
		return cordova.exec(successCallback, failureCallback, "FtpClient","Connect",userInfo);
	};
	FtpClient.prototype.Disconnect = function(successCallback, failureCallback, userInfo) {
		
		return cordova.exec(successCallback, failureCallback, "FtpClient","Disconnect",userInfo);
	};
    FtpClient.prototype.downloadFile = function(successCallback, failureCallback, userInfo) {
        
		return cordova.exec(successCallback, failureCallback, "FtpClient","downloadFile",userInfo);
	};
	cordova.addConstructor(function() {
		window.plugins = window.plugins || {};
		window.plugins.ftpclient = new FtpClient();
	});
    
    
    
    
   
})(window.cordova || window.Cordova);