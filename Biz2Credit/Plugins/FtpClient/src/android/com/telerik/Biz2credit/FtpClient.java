package com.telerik.Biz2Credit;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Calendar;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.os.Environment;
import android.util.Log;
import it.sauronsoftware.ftp4j.FTPAbortedException;
import it.sauronsoftware.ftp4j.FTPClient;
import it.sauronsoftware.ftp4j.FTPDataTransferException;
import it.sauronsoftware.ftp4j.FTPException;
import it.sauronsoftware.ftp4j.FTPIllegalReplyException;
import java.io.IOException;
import android.content.Context;
import android.os.Handler;



/* Copy write 23-12-2013
 * Sakshay WebTechnology Pvt Ltd
 * www.sakshay.in
 */
public class FtpClient extends CordovaPlugin {
    public static final String ACTION = "saveImageDataToLibrary";
    private FTPClient ftpClient;
    private long fileSize=0;
    public static final String ACTION_DOWNLOAD = "downloadFile";
    //public static final String ACTION_UPLOAD = "uploadFile";
	public static final String ACTION_CONNECT = "Connect";
	public static final String ACTION_DISCONNECT = "Disconnect";
    
    public static final String SUCCESS = "success";
    public static final String PARSINGERROR = "parsing error";
    public static final String CONNEERROR = "conn error";
    public static final String URIERROR = "uri error";
    public static final String EXCEPTION = "exception";
    public static final String FTPABORTEDEXCEPTION = "ftpabortedexception";
    public static final String FTPDATATRANSFEREXCEPTION = "ftpdatattransferexception";
    public static final String FTPEXCEPTION = "ftpexception";
    public static final String FTPILLEGALREPLYEXCEPTION = "ftpillegalreplyexception";
    public static final String IOEXCEPTION = "ioexception";
    public static final String SOCKET_TIMEOUTEXCEPTION = "socket_timeout";
    public static final String SOCKET_NOEXCEPTION = "socket_noexception";
    
    public static  String host ;// storagetest.in
    public static  String user_name;
public static  String ftp_path;
public static  String server_file_name;
public static  String file_name;
    public static final String PASSWORD = "4Lz}+u&ZiizD5o1y";
    

    @Override
    public boolean execute(String action, JSONArray data,
            final CallbackContext callbackContext) throws JSONException {

            host=data.optString(0);
            String ftpPassword=data.optString(1);
            ftp_path=data.optString(2);

            String ftpRelativePath=data.optString(3);
            user_name=data.optString(4);
           server_file_name=data.optString(5);
            file_name=data.optString(6);

            if(action.equalsIgnoreCase(ACTION_CONNECT)){
               Handler h=new Handler();
               h.postDelayed(new Runnable() {
            
                @Override
                public void run() {
                // TODO Auto-generated method stub
                String s=setFtpConnection();
                if(s.equalsIgnoreCase(SOCKET_NOEXCEPTION)){
                    
                    callbackContext.success("Success");
                }
            }
        }, 1);
		return true;
		}
        
        if(action.equals(ACTION_DOWNLOAD)) {
            if(isConnected())
            {
                String status=downloadFile(server_file_name,file_name,ftp_path);
                if(status.equalsIgnoreCase(SUCCESS)){
                    callbackContext.success("Success");
                    return true;
                }
            }
            else
            {
                callbackContext.error("Connection to Server Failed");
                return false;
            }

        }

        return false;
      
    }


public String downloadFile(String serverFileName,
            String localFileName,String fullPath) {
        String result = "";
        
        // download in sdcard
		String pat=Environment.getExternalStorageDirectory()+"/biz2docs";
        File root = new File(pat);
        File file = new File(root, localFileName);
        try {
            
            
            Log.i("FTP full path : ", fullPath);
            ftpClient.changeDirectory(fullPath);
            ftpClient.download(serverFileName,file);
            result = SUCCESS;
        } catch (IllegalStateException e) {
            // TODO Auto-generated catch block
            Log.i("FTP Exception", "IllegalStateException");
            e.printStackTrace();
            result = EXCEPTION;
            disconnectFTP();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            Log.i("FTP Exception", "IOException");
            e.printStackTrace();
            result = IOEXCEPTION;
            disconnectFTP();
        } catch (FTPIllegalReplyException e) {
            // TODO Auto-generated catch block
            Log.i("FTP Exception", "FTPIllegalReplyException");
            e.printStackTrace();
            result = FTPILLEGALREPLYEXCEPTION;
            disconnectFTP();
        } catch (FTPException e) {
            // TODO Auto-generated catch block
            Log.i("FTP Exception", "FTPException");
            e.printStackTrace();
            result = FTPEXCEPTION;
            disconnectFTP();
        } catch (FTPDataTransferException e) {
            // TODO Auto-generated catch block
            Log.i("FTP Exception", "FTPDataTransferException");
            e.printStackTrace();
            result = FTPDATATRANSFEREXCEPTION;
            disconnectFTP();
        } catch (FTPAbortedException e) {
            // TODO Auto-generated catch block
            Log.i("FTP Exception", "FTPAbortedException");
            e.printStackTrace();
            result = FTPABORTEDEXCEPTION;
            disconnectFTP();
        } catch(Exception e){
            // TODO Auto-generated catch block
            Log.i("FTP Exception", "Exception");
            e.printStackTrace();
            result = FTPABORTEDEXCEPTION;
            disconnectFTP();
        }
        return result;
    }

public String setFtpConnection() {
        if (ftpClient == null)
            ftpClient = new FTPClient();
        String exception = SOCKET_NOEXCEPTION;
        if (!ftpClient.isConnected()) {
            try {
                ftpClient.connect(host, 21);
                ftpClient.login(user_name, PASSWORD);
                ftpClient.setType(FTPClient.TYPE_BINARY);
                exception = SOCKET_NOEXCEPTION;
            } catch (IllegalStateException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                exception = FTPEXCEPTION;
                disconnectFTP();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                disconnectFTP();
                exception = SOCKET_TIMEOUTEXCEPTION;
            } catch (FTPIllegalReplyException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                exception = FTPEXCEPTION;
                disconnectFTP();
            } catch (FTPException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                exception = FTPEXCEPTION;
                disconnectFTP();
            }
        }
        return exception;
    }

public void disconnectFTP() {
        Log.i("FTP", "disconnectFTP method ");
        if (ftpClient.isConnected()) {
            try {
                if (ftpClient.isAuthenticated()) {
                    ftpClient.logout();
                }
                ftpClient.disconnect(true);
            } catch (IllegalStateException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (FTPIllegalReplyException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (FTPException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        ftpClient = null;
    }

public boolean isConnected() {
        boolean b = false;
        if (ftpClient != null)
            if (ftpClient.isAuthenticated() && ftpClient.isConnected())
                b = true;
        return b;
    }

}