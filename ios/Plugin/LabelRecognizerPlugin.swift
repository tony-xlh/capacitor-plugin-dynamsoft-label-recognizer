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
        var base64 = call.getString("base64") ?? ""
        base64 = removeDataURLHead(base64)
        call.resolve(["results":implementation.recognizeBase64String(base64)])
    }
    
    func removeDataURLHead(_ str: String) -> String {
        var finalStr = str
        do {
            let pattern = "data:.*?;base64,"
            let regex = try NSRegularExpression(pattern: pattern, options: NSRegularExpression.Options.caseInsensitive)
            finalStr = regex.stringByReplacingMatches(in: str, options: NSRegularExpression.MatchingOptions(rawValue: 0), range: NSMakeRange(0, str.count), withTemplate: "")
        }
        catch {
            print(error)
        }
        return finalStr
    }
    
    @objc func updateRuntimeSettings(_ call: CAPPluginCall) {
        let settings = call.getAny("settings") as? [String:Any]
        let template = settings!["template"] as! String
        implementation.updateRuntimeSettings(template)
        
        guard let customModelConfig = settings!["customModelConfig"] as? [String:Any] else {
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
