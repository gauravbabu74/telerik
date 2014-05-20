//
//  Canvas2ImagePlugin.h
//  Canvas2ImagePlugin PhoneGap/Cordova plugin
//
//  Created by Tommy-Carlos Williams on 29/03/12.
//  Copyright (c) 2012 Tommy-Carlos Williams. All rights reserved.
//	MIT Licensed
//


#import <Cordova/CDVPlugin.h>
#import  <NMSSH/NMSSH.h>


@interface FtpClient : CDVPlugin<NMSSHSessionDelegate>
{
    NSString* callback;
    NSString* disconnectcallback;
    NSString *savedfileName;
    NMSFTP *nmsft;
    bool isDisconnected;
    NMSSHSession *session1;
}

@property (nonatomic, copy) NSString* callback;

- (void)downloadFile:(CDVInvokedUrlCommand*)command;
- (void)Disconnect:(CDVInvokedUrlCommand*)command;
@end
