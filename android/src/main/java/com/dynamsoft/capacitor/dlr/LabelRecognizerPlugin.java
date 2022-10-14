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
    public void init(PluginCall call) {
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
    public void updateRuntimeSettings(PluginCall call) {
        JSObject settings = call.getObject("settings");
        String template = settings.getString("template");
        try {
            implementation.updateRuntimeSettings(template);
        } catch (LabelRecognizerException e) {
            e.printStackTrace();
        }
        if (call.hasOption("customModelConfig")) {
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
}
