package com.dynamsoft.capacitor.dlr;

import android.util.Log;

import com.dynamsoft.dlr.DLRResult;
import com.dynamsoft.dlr.LabelRecognizerException;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONException;

import java.lang.reflect.InvocationTargetException;

@CapacitorPlugin(name = "LabelRecognizer")
public class LabelRecognizerPlugin extends Plugin {

    private LabelRecognizer implementation = new LabelRecognizer();

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");
        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }

    @PluginMethod
    public void initLicense(PluginCall call) {
        String license = call.getString("license");
        implementation.initLicense(license,getContext());
        call.resolve();
    }

    @PluginMethod
    public void initialize(PluginCall call) {
        try {
            implementation.initDLR();
            call.resolve();
        } catch (LabelRecognizerException e) {
            e.printStackTrace();
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void recognizeBase64String(PluginCall call) {
        String base64 = call.getString("base64");
        base64 = base64.replaceFirst("data:.*?;base64,","");
        Log.d("DLR",base64);
        try {
            JSArray results = implementation.recognizeBase64String(base64);
            JSObject response = new JSObject();
            response.put("results",results);
            call.resolve(response);
        } catch (LabelRecognizerException e) {
            e.printStackTrace();
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void recognizeBitmap(PluginCall call) {
        try {
            String className = call.getString("className","com.tonyxlh.capacitor.camera.CameraPreviewPlugin");
            String methodName = call.getString("methodName","getBitmap");
            JSArray results = implementation.recognizeBitmap(className,methodName);
            JSObject response = new JSObject();
            response.put("results",results);
            call.resolve(response);
        } catch (LabelRecognizerException | InvocationTargetException | IllegalAccessException |
                 NoSuchMethodException | ClassNotFoundException e) {
            e.printStackTrace();
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void updateRuntimeSettings(PluginCall call) {
        JSObject settings = call.getObject("settings");
        String template = settings.getString("template");
        try {
            implementation.updateRuntimeSettings(template);
        } catch (LabelRecognizerException e) {
            e.printStackTrace();
        }
        if (settings.has("customModelConfig")) {
            JSObject config = settings.getJSObject("customModelConfig");
            String modelFolder = config.getString("customModelFolder");
            try {
                JSONArray fileNames = config.getJSONArray("customModelFileNames");
                implementation.loadCustomModel(getContext(), modelFolder, fileNames);
            } catch (JSONException | LabelRecognizerException e) {
                e.printStackTrace();
            }
        }
        call.resolve();
    }

    @PluginMethod
    public void resetRuntimeSettings(PluginCall call) {
        try {
            implementation.resetRuntimeSettings();
            call.resolve();
        } catch (LabelRecognizerException e) {
            e.printStackTrace();
            call.reject(e.getMessage());
        }
    }
}
