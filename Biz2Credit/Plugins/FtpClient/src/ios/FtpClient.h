//
//  Canvas2ImagePlugin.h
//  Canvas2ImagePlugin PhoneGap/Cordova plugin
//
//  Created by Tommy-Carlos Williams on 29/03/12.
//  Copyright (c) 2012 Tommy-Carlos Williams. All rights reserved.
//	MIT Licensed
//


#import <Cordova/CDVPlugin.h>
//#import "WhiteRaccoon.h"
#import "BRRequestDownload.h"
#import "BRRequestDelete.h"
#import "BRRequest+_UserData.h"



@interface FtpClient : CDVPlugin<BRRequestDelegate>
{
	NSString* callback;
    BRRequestDownload *downloadFile;
    NSMutableData *downloadData;
    NSMutableData *uploadData;
    NSString *savedfileName;
    CDVInvokedUrlCommand* recievedCommand;
}

@property (nonatomic, copy) NSString* callback;

- (void)downloadFile:(CDVInvokedUrlCommand*)command;
- (void)Disconnect:(CDVInvokedUrlCommand*)command;
@end
