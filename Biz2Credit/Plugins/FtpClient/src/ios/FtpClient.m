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
   // NSLog(@"%@ fa!123", command.callbackId);
    //NSDictionary *jsonObj =[[NSDictionary alloc] initWithObjectsAndKeys:@"true", @"isPaused",nil];

//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"gaurav"];
  //  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
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
	NSLog(@" arrOfParams~~~~121212~");
	NSLog(@"%@ downloadingPath~~~~~", downloadingPath);
	NSLog(@"%@ Hostname~~~~~", Hostname);
	NSLog(@"%@ Username~~~~~", Username);
	NSLog(@"%@ Password~~~~~", Password);
	NSLog(@"%@ ServerFileName~~~~~", ServerFileName);
	NSLog(@"%@ fileName~~~~~", fileName);
    downloadData = [[NSMutableData alloc]init];
    NSString* str = @"";
    NSData* data = [str dataUsingEncoding:NSUTF8StringEncoding];
    [downloadData appendData:data];
    downloadFile.path = @"/public_html/components/com_brief/files/12516/154728.file";
    NSArray *arr = [downloadFile.path componentsSeparatedByString:@"/"];
    fileName = [arr lastObject];
    [downloadFile setHostname:@"107.21.114.127"];
    [downloadFile setUsername:@"b2cdocs"];
    [downloadFile setPassword:@"4Lz}+u&ZiizD5o1y"];
    [downloadFile start]; 
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

    NSString *length = [NSString stringWithFormat:@"%d",request.receivedData.length];
    [downloadData appendData:request.receivedData];
   
}
-(void) requestCompleted: (BRRequest *) request
{
    if (request == downloadFile)
    {
        
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);

        NSString *documentsDirectory = [paths objectAtIndex:0];

        NSString *tempFolderPath = [documentsDirectory stringByAppendingPathComponent:@"biz2docs"];

        [[NSFileManager defaultManager] createDirectoryAtPath:tempFolderPath withIntermediateDirectories:YES attributes:nil error:NULL];
        tempFolderPath = [tempFolderPath stringByAppendingPathComponent:@"154728.file"];

        if (![[NSFileManager defaultManager] fileExistsAtPath:tempFolderPath]) {
        [[NSFileManager defaultManager] createFileAtPath:tempFolderPath contents:nil attributes:nil];
        }
        BOOL success;
        success  = [downloadData writeToFile:tempFolderPath atomically:YES];
        if (success) {
			NSLog(@"%@ su!123", request);
             NSLog(@"%@ tempFolderPath 123", tempFolderPath);
            //NSDictionary *jsonObj =[[NSDictionary alloc]initWithObjectsAndKeys:tempFolderPath, @"savedFilePath",@"true", @"success",nil];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Sucess"];
             NSLog(@"%@ recievedCommand.callbackId 123", callback);
			[self.commandDelegate sendPluginResult:pluginResult callbackId:callback];
      	 }else{
           // NSDictionary *jsonObj =[[NSDictionary alloc]initWithObjectsAndKeys:@"", @"savedFilePath",@"false", @"success",nil];
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Fail"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:recievedCommand.callbackId];
        	NSLog(@"%@ fa!123", request);
       }
        downloadData = nil;
    }
    
}

- (void) percentCompleted: (BRRequest *) request
{

  NSString *length = [NSString stringWithFormat:@"%f",request.percentCompleted];
 UIAlertView *alert=[[UIAlertView alloc] initWithTitle:@"Message" message:length delegate:nil cancelButtonTitle:@"ok" otherButtonTitles: nil] ;
        //[alert show];
    NSLog(@"%f completed...",request.percentCompleted);
    NSLog(@"%ld bytes this iteration", request.bytesSent);
    NSLog(@"%ld total bytes",request.totalBytesSent);
    
}

-(void) requestFailed:(BRRequest *) request
{
    
    NSLog(@"%@",request.error.message);
   // NSDictionary *jsonObj =[[NSDictionary alloc]initWithObjectsAndKeys:request.error.message, @"savedFilePath",@"false", @"success",nil];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Fail"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:recievedCommand.callbackId];
    
   
    
}



@end
