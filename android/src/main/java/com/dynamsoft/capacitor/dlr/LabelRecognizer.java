package com.dynamsoft.capacitor.dlr;

import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.util.Log;

import com.dynamsoft.core.CoreException;
import com.dynamsoft.core.LicenseManager;
import com.dynamsoft.core.LicenseVerificationListener;
import com.dynamsoft.dlr.DLRResult;
import com.dynamsoft.dlr.LabelRecognizerException;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;

import org.json.JSONArray;

import java.io.InputStream;

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
        Log.d("DLR",license);
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

    public void updateRuntimeSettings(String template) throws LabelRecognizerException {
        Log.d("DLR",template);
        recognizer.initRuntimeSettings(template);
    }

    public void loadCustomModel(Context ctx, String modelFolder, JSONArray fileNames) throws LabelRecognizerException {
        Log.d("DLR","model folder: "+modelFolder);
        try {
            for(int i = 0;i<fileNames.length();i++) {
                Log.d("DLR","filename: "+fileNames.get(i));
                AssetManager manager = ctx.getAssets();
                InputStream isPrototxt = manager.open(modelFolder+"/"+fileNames.getString(i)+".prototxt");
                byte[] prototxt = new byte[isPrototxt.available()];
                isPrototxt.read(prototxt);
                isPrototxt.close();
                InputStream isCharacterModel = manager.open(modelFolder+"/"+fileNames.getString(i)+".caffemodel");
                byte[] characterModel = new byte[isCharacterModel.available()];
                isCharacterModel.read(characterModel);
                isCharacterModel.close();
                InputStream isTxt = manager.open(modelFolder+"/"+fileNames.getString(i)+".txt");
                byte[] txt = new byte[isTxt.available()];
                isTxt.read(txt);
                isTxt.close();
                recognizer.appendCharacterModelBuffer(fileNames.getString(i), prototxt, txt, characterModel);
            }
            Log.d("DLR","custom model loaded");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
