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


- (void)dealloc
{	
	[callbackId release];
    [super dealloc];
}

- (void)downloadFile:(CDVInvokedUrlCommand*)command
{
   // recievedCommand = command;
    // [self startDownloadFile:command.arguments]; 

    NSDictionary *jsonObj =[[NSDictionary alloc] initWithObjectsAndKeys:@"true", @"isPaused",nil];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary: jsonObj];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


-(void)startDownloadFile:(NSArray*)arrOfParams
{
    
  
    downloadFile = [[BRRequestDownload alloc] initWithDelegate:self];
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
            NSDictionary *jsonObj =[[NSDictionary alloc]initWithObjectsAndKeys:tempFolderPath, @"savedFilePath",@"true", @"success",nil];
            CDVPluginResult *pluginResult =[CDVPluginResult resultWithStatus: CDVCommandStatus_OK messageAsDictionary :jsonObj];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:recievedCommand.callbackId];
      	 }else{
            NSDictionary *jsonObj =[[NSDictionary alloc]initWithObjectsAndKeys:@"", @"savedFilePath",@"false", @"success",nil];
            CDVPluginResult *pluginResult =[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary :jsonObj];
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
    NSDictionary *jsonObj =[[NSDictionary alloc]initWithObjectsAndKeys:request.error.message, @"savedFilePath",@"false", @"success",nil];
    CDVPluginResult *pluginResult =[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary :jsonObj];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:recievedCommand.callbackId];
    
    UIAlertView *alert=[[UIAlertView alloc] initWithTitle:@"Message" message:request.error.message delegate:nil cancelButtonTitle:@"OK" otherButtonTitles: nil] ;
    [alert show];
    
}



@end
