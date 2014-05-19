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
    [self startDownloadFile:arrOfParams]; 
  
}


-(void)startDownloadFile:(NSArray*)arrOfParams
{
 [self.commandDelegate runInBackground:^{
    NSString *downloadingPath;
    NSString *Hostname;
    NSString *Username;
    NSString *Password;
    NSString *ServerFileName;
    NSString *fileName;
    
    if (arrOfParams!=nil) 
    {
        downloadingPath = [arrOfParams objectAtIndex:2];
        Hostname = [arrOfParams objectAtIndex:0];
        Username = [arrOfParams objectAtIndex:3];
        Password = [arrOfParams objectAtIndex:1];
        ServerFileName = [arrOfParams objectAtIndex:4];
        fileName = [arrOfParams objectAtIndex:5];
    }
    
    NSLog(@"~~~downloadingPath%@",downloadingPath);
NSLog(@"~~~ServerFileName%@",ServerFileName);
    NSString *downloadingPathWithServerFileName = [downloadingPath stringByAppendingPathComponent:ServerFileName];
    savedfileName = [[NSString alloc]initWithString:fileName];
    
    NMSSHSession *session = [NMSSHSession connectToHost:Hostname
    withUsername:Username];
    
    if (session.isConnected) 
    {
                NSLog(@"~~~~session.isConnected");

    	[session authenticateByPassword:Password];
        if (session.isAuthorized) 
        {
         		NSLog(@"~~~~session.isAuthorized");
NSLog(@"~~~downloadingPathWithServerFileName%@",downloadingPathWithServerFileName);
            nmsft = [NMSFTP  connectWithSession:session];

            NSData*downloadedData = [nmsft contentsAtPath:downloadingPathWithServerFileName];
            NSLog(@"~~~~downloadedData--");

            NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
            
            NSString *documentsDirectory = [paths objectAtIndex:0];
            
            NSString *tempFolderPath = [documentsDirectory stringByAppendingPathComponent:@"biz2docs"];
            
            [[NSFileManager defaultManager] createDirectoryAtPath:tempFolderPath withIntermediateDirectories:YES attributes:nil error:NULL];
            tempFolderPath = [tempFolderPath stringByAppendingPathComponent:savedfileName];
            
            if (![[NSFileManager defaultManager] fileExistsAtPath:tempFolderPath]) 
            {
            	[[NSFileManager defaultManager] createFileAtPath:tempFolderPath contents:nil attributes:nil];
            }
            BOOL success;
            success  = [downloadedData writeToFile:tempFolderPath atomically:YES];
            if (success) 
            {
                 NSLog(@"~~~~downloadedData saved in local biz2docs ");
            	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Success"];
            	[self.commandDelegate sendPluginResult:pluginResult callbackId:callback];
            
            }
            else
            {
            
            	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Server not responding properly"];
            	[self.commandDelegate sendPluginResult:pluginResult callbackId:callback];
            
        	}
       }
    }
    [session disconnect];
}];
}

- (void)Disconnect:(CDVInvokedUrlCommand*)command{
[self.commandDelegate runInBackground:^{
		[nmsft.session disconnect];
		CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Success"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callback];
}];
}

@end
