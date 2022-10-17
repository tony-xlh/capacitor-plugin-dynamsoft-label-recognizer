#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(LabelRecognizerPlugin, "LabelRecognizer",
           CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(initialize, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(initLicense, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(recognizeBase64String, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateRuntimeSettings, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(resetRuntimeSettings, CAPPluginReturnPromise);
)
