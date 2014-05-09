//
//  Canvas2ImagePlugin.m
//  Canvas2ImagePlugin PhoneGap/Cordova plugin
//
//  Created by Tommy-Carlos Williams on 29/03/12.
//  Copyright (c) 2012 Tommy-Carlos Williams. All rights reserved.
//	MIT Licensed
//

#import "FtpClient.h"
#import <Cordova/CDV.h>

@implementation FtpClient
@synthesize callbackId;





- (void)image:(UIImage *)image didFinishSavingWithError:(NSError *)error contextInfo:(void *)contextInfo
{
    // Was there an error?
    if (error != NULL)
    {
        // Show error message...
        NSLog(@"ERROR: %@",error);
		CDVPluginResult* result = [CDVPluginResult resultWithStatus: CDVCommandStatus_ERROR messageAsString:error.description];
		[self.webView stringByEvaluatingJavaScriptFromString:[result toErrorCallbackString: self.callbackId]];
    }
    else  // No errors
    {
        // Show message image successfully saved
        NSLog(@"IMAGE SAVED!");
		CDVPluginResult* result = [CDVPluginResult resultWithStatus: CDVCommandStatus_OK messageAsString:@"Image saved"];
		[self.webView stringByEvaluatingJavaScriptFromString:[result toSuccessCallbackString: self.callbackId]];
    }
}

- (void)dealloc
{	
	[callbackId release];
    [super dealloc];
}

- (void)downloadFile:(CDVInvokedUrlCommand*)command
{
 //   UIAlertView *alert=[[UIAlertView alloc] initWithTitle:@"Message" message:@"Abhishek msg" delegate:nil cancelButtonTitle:@"ok" otherButtonTitles: nil] ;
  //      [alert show];
    recievedCommand = command;
    
    [self startDownloadFile:command.arguments];

}

-(void)startDownloadFile:(NSArray*)arrOfParams
{
    
  
    downloadFile = [[BRRequestDownload alloc] initWithDelegate:self];
    //the path needs to be absolute to the FTP root folder.
    //full URL would be ftp://xxx.xxx.xxx.xxx/space.jpg
   
    NSString *downloadingPath;
    NSString *Hostname;
    NSString *Username;
    NSString *Password;
    
    if (arrOfParams!=nil) {
        downloadingPath = [arrOfParams objectAtIndex:0];
        Hostname = [arrOfParams objectAtIndex:1];
        Username = [arrOfParams objectAtIndex:2];
        Password = [arrOfParams objectAtIndex:3];
    }
     UIAlertView *alert=[[UIAlertView alloc] initWithTitle:@"Message" message:@"startDownloadFile" delegate:nil cancelButtonTitle:@"ok" otherButtonTitles: nil] ;
        [alert show];
   // downloadData = [[NSMutableData alloc]init];
    downloadData = [NSMutableData dataWithCapacity:1];
    downloadFile.path = @"/public_html/components/com_brief/files/12516/154724.file";
    NSArray *arr = [downloadFile.path componentsSeparatedByString:@"/"];
    fileName = [arr lastObject];
    [downloadFile setHostname:@"107.21.114.127"];
    [downloadFile setUsername:@"b2cdocs"];
    
    [downloadFile setPassword:@"4Lz}+u&ZiizD5o1y"];
    
    
    //we start the request
    [downloadFile start];
    
    
}

- (long) requestDataSendSize: (BRRequestUpload *) request
{
 UIAlertView *alert=[[UIAlertView alloc] initWithTitle:@"Message" message:@"requestDataSendSize" delegate:nil cancelButtonTitle:@"ok" otherButtonTitles: nil] ;
        [alert show];
    //----- user returns the total size of data to send. Used ONLY for percentComplete
    return [uploadData length];
    
}

- (NSData *)requestDataToSend:(BRRequestUpload *) request
{

 UIAlertView *alert=[[UIAlertView alloc] initWithTitle:@"Message" message:@"requestDataToSend" delegate:nil cancelButtonTitle:@"ok" otherButtonTitles: nil] ;
        [alert show];
    //----- returns data object or nil when complete
    //----- basically, first time we return the pointer to the NSData.
    //----- and BR will upload the data.
    //----- Second time we return nil which means no more data to send
   
    NSData *temp = uploadData;
    
    // this is a shallow copy of the pointer, not a deep copy
    
    uploadData = nil; // next time around, return nil...
    
    return temp;
}

#pragma mark
#pragma mark ftp White Raccon delegates  Methods

- (void) requestDataAvailable: (BRRequestDownload *) request;
{

 NSString *length = [NSString stringWithFormat:@"%d",request.receivedData.length];
       UIAlertView *alert=[[UIAlertView alloc] initWithTitle:@"Message" message:length delegate:nil cancelButtonTitle:@"ok" otherButtonTitles: nil] ;
        [alert show];
   // [downloadData appendData:request.receivedData];
    
}
-(void) requestCompleted: (BRRequest *) request
{
     UIAlertView *alert=[[UIAlertView alloc] initWithTitle:@"Message" message:@"requestCompleted" delegate:nil cancelButtonTitle:@"ok" otherButtonTitles: nil] ;
        [alert show];
    NSLog(@"%@ completed!", request);
    
    if (request == downloadFile)
    {
        NSLog(@"%@ completed!", request);
        
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0];
        NSString *tempFolderPath = [documentsDirectory stringByAppendingPathComponent:@"biz2docs"];
        
        [[NSFileManager defaultManager] createDirectoryAtPath:tempFolderPath withIntermediateDirectories:YES attributes:nil error:NULL];
        tempFolderPath = [tempFolderPath stringByAppendingPathComponent:fileName];
        
        if (![[NSFileManager defaultManager] fileExistsAtPath:tempFolderPath]) {
            [[NSFileManager defaultManager] createFileAtPath:tempFolderPath contents:nil attributes:nil];
        }
        BOOL success;
        success  = [downloadData writeToFile:tempFolderPath atomically:YES];
        
        if (success) {
            NSDictionary *jsonObj =[[NSDictionary alloc]initWithObjectsAndKeys:tempFolderPath, @"savedFilePath",@"true", @"success",nil];
            CDVPluginResult *pluginResult =[CDVPluginResult resultWithStatus: CDVCommandStatus_OK messageAsDictionary :jsonObj];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:recievedCommand.callbackId];
        }else{
            NSDictionary *jsonObj =[[NSDictionary alloc]initWithObjectsAndKeys:@"", @"savedFilePath",@"false", @"success",nil];
            CDVPluginResult *pluginResult =[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary :jsonObj];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:recievedCommand.callbackId];
        
        }
        
    }
    
}

- (void) percentCompleted: (BRRequest *) request
{

  NSString *length = [NSString stringWithFormat:@"%f",request.percentCompleted];
 UIAlertView *alert=[[UIAlertView alloc] initWithTitle:@"Message" message:length delegate:nil cancelButtonTitle:@"ok" otherButtonTitles: nil] ;
        [alert show];
    NSLog(@"%f completed...",request.percentCompleted);
    NSLog(@"%ld bytes this iteration", request.bytesSent);
    NSLog(@"%ld total bytes",request.totalBytesSent);
    
}

-(void) requestFailed:(BRRequest *) request
{
    
    NSLog(@"%@",request.error.message);
    NSDictionary *jsonObj =[[NSDictionary alloc]initWithObjectsAndKeys:request.error.message, @"savedFilePath",@"false", @"success",nil];
    CDVPluginResult *pluginResult =[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary :jsonObj];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:recievedCommand.callbackId];
    
    UIAlertView *alert=[[UIAlertView alloc] initWithTitle:@"Message" message:request.error.message delegate:nil cancelButtonTitle:@"OK" otherButtonTitles: nil] ;
    [alert show];
    
}



@end
