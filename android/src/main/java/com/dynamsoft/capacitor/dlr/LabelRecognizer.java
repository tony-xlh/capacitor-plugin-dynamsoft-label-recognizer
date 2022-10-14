package com.dynamsoft.capacitor.dlr;

import android.content.Context;
import android.graphics.Bitmap;
import android.util.Log;

import com.dynamsoft.core.CoreException;
import com.dynamsoft.core.LicenseManager;
import com.dynamsoft.core.LicenseVerificationListener;
import com.dynamsoft.dlr.DLRResult;
import com.dynamsoft.dlr.LabelRecognizerException;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;

public class LabelRecognizer {

    private com.dynamsoft.dlr.LabelRecognizer recognizer;

    public String echo(String value) {
        Log.i("Echo", value);
        return value;
    }

    public void initDLR() throws LabelRecognizerException {
        recognizer = new com.dynamsoft.dlr.LabelRecognizer();
    }

    public void initLicense(String license, Context context) {
        LicenseManager.initLicense(license, context, new LicenseVerificationListener() {
            @Override
            public void licenseVerificationCallback(boolean isSuccess, CoreException error) {
                if(!isSuccess){
                    error.printStackTrace();
                }
            }
        });
    }

    public JSArray recognizeBase64String(String base64) throws LabelRecognizerException {
        Bitmap bm = Utils.base642Bitmap(base64);
        DLRResult[] results = recognizer.recognizeImage(bm);
        JSArray array = new JSArray();
        for (DLRResult result:results) {
            array.put(Utils.getMapFromDLRResult(result));
        }
        return array;
    }
}
