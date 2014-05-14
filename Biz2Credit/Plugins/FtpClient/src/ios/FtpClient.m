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
@synthesize callback;


- (void)dealloc
{	
	[callback release];
    [super dealloc];
}

- (void)downloadFile:(CDVInvokedUrlCommand*)command
{
    NSString *downloadingPath= [command argumentAtIndex:2];
    NSString *Hostname = [command argumentAtIndex:0];
    NSString *Username= [command argumentAtIndex:4];
    NSString *Password= [command argumentAtIndex:1];
    NSString *ServerFileName= [command argumentAtIndex:5];
    NSString *fileName= [command argumentAtIndex:6];
    NSArray *arrOfParams = [NSArray arrayWithObjects:Hostname,Password,downloadingPath,Username,ServerFileName,fileName, nil];
    callback = [[NSString alloc]initWithString:command.callbackId];
    recievedCommand = command;
    [self startDownloadFile:arrOfParams]; 
  
}


-(void)startDownloadFile:(NSArray*)arrOfParams
{
    downloadFile = [[BRRequestDownload alloc] initWithDelegate:self];
    NSString *downloadingPath;
    NSString *Hostname;
    NSString *Username;
    NSString *Password;
    NSString *ServerFileName;
	NSString *fileName;

    if (arrOfParams!=nil) {
        downloadingPath = [arrOfParams objectAtIndex:2];
        Hostname = [arrOfParams objectAtIndex:0];
        Username = [arrOfParams objectAtIndex:3];
        Password = [arrOfParams objectAtIndex:1];
        ServerFileName = [arrOfParams objectAtIndex:4];
        fileName = [arrOfParams objectAtIndex:5];
    }
    
	//requestCancelled =NO;
    downloadData = [[NSMutableData alloc]init];
    NSString* str = @"";
    NSData* data = [str dataUsingEncoding:NSUTF8StringEncoding];
    [downloadData appendData:data];
    downloadFile.path = [downloadingPath stringByAppendingPathComponent:ServerFileName];
    savedfileName = [[NSString alloc]initWithString:fileName];
   
    [downloadFile setHostname:Hostname];
    [downloadFile setUsername:Username];
    [downloadFile setPassword:Password];
    [downloadFile start]; 
}

-(void)Disconnect:(CDVInvokedUrlCommand*)command
{
    if(downloadFile)
    {
        downloadFile.cancelDoesNotCallDelegate = TRUE;
        [downloadFile cancelRequest];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Download process aborted successfully"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    else
    {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Cancel Request Fail"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
	

}


- (long) requestDataSendSize: (BRRequestUpload *) request
{
    
//----- user returns the total size of data to send. Used ONLY for percentComplete
    return [uploadData length];

}

- (NSData *)requestDataToSend:(BRRequestUpload *) request
{
  
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

 if (request == downloadFile){
    NSString *length = [NSString stringWithFormat:@"%d",request.receivedData.length];
    [downloadData appendData:request.receivedData];

}
   
}
-(void) requestCompleted: (BRRequest *) request
{

    if (request == downloadFile && request.streamInfo.cancelRequestFlag == NO)
    {      
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);

        NSString *documentsDirectory = [paths objectAtIndex:0];

        NSString *tempFolderPath = [documentsDirectory stringByAppendingPathComponent:@"biz2docs"];

        [[NSFileManager defaultManager] createDirectoryAtPath:tempFolderPath withIntermediateDirectories:YES attributes:nil error:NULL];
		tempFolderPath = [tempFolderPath stringByAppendingPathComponent:savedfileName];

        if (![[NSFileManager defaultManager] fileExistsAtPath:tempFolderPath]) {
        [[NSFileManager defaultManager] createFileAtPath:tempFolderPath contents:nil attributes:nil];
        }
        BOOL success;
        success  = [downloadData writeToFile:tempFolderPath atomically:YES];
        if (success) {
			
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Success"];
			[self.commandDelegate sendPluginResult:pluginResult callbackId:callback];

      	 }else{

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Server not responding properly"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:recievedCommand.callbackId];

       }
    downloadData = nil;
    downloadFile = nil;
    }
    
}

- (void) percentCompleted: (BRRequest *) request
{

 if (request == downloadFile){
    NSLog(@"%f completed...",request.percentCompleted);
    NSLog(@"%ld bytes this iteration", request.bytesSent);
    NSLog(@"%ld total bytes",request.totalBytesSent);

}
    
}

-(void) requestFailed:(BRRequest *) request
{
   
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Fail"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:recievedCommand.callbackId];
   
}

@end
