import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(LabelRecognizerPlugin)
public class LabelRecognizerPlugin: CAPPlugin  {
    private let implementation = LabelRecognizer()

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }
    
    @objc func initialize(_ call: CAPPluginCall) {
        implementation.initialize()
        call.resolve()
    }
    
    @objc func initLicense(_ call: CAPPluginCall) {
        let license = call.getString("license") ?? "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="
        implementation.initLicense(license)
        call.resolve()
    }
    
    @objc func recognizeBase64String(_ call: CAPPluginCall) {
        let base64 = call.getString("base64") ?? ""
        call.resolve(["results":implementation.recognizeBase64String(base64)])
    }
    
    @objc func updateRuntimeSettings(_ call: CAPPluginCall) {
        let template = call.getString("template") ?? ""
        implementation.updateRuntimeSettings(template)
        
        guard let customModelConfig = call.getAny("customModelConfig") as? [String:Any] else {
            call.resolve()
            return
        }
        let modelFolder = customModelConfig["customModelFolder"] as! String
        let modelFileNames = customModelConfig["customModelFileNames"] as! [String]
        implementation.loadCustomModel(modelFolder: modelFolder, modelFileNames: modelFileNames)
        call.resolve()
    }
    
    @objc func resetRuntimeSettings(_ call: CAPPluginCall) {
        implementation.resetRuntimeSettings()
        call.resolve()
    }
}
