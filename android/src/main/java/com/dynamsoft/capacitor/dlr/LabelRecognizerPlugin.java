package com.dynamsoft.capacitor.dlr;

import com.dynamsoft.dlr.DLRResult;
import com.dynamsoft.dlr.LabelRecognizerException;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "LabelRecognizer")
public class LabelRecognizerPlugin extends Plugin {

    private LabelRecognizer implementation = new LabelRecognizer(getContext());

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
        implementation.initLicense(license);
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
}
