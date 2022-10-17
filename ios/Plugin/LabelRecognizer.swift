import Foundation
import DynamsoftCore
import DynamsoftLabelRecognizer

@objc public class LabelRecognizer: NSObject, LicenseVerificationListener {
    private var recognizer:DynamsoftLabelRecognizer!;
    
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
    
    @objc public func initialize() {
        recognizer = DynamsoftLabelRecognizer.init()
    }
    
    @objc public func initLicense(_ license: String) {
        DynamsoftLicenseManager.initLicense(license,verificationDelegate:self)
    }
    
    public func licenseVerificationCallback(_ isSuccess: Bool, error: Error?) {
        
    }
    
    @objc public func recognizeBase64String(_ base64: String) -> [Any] {
        var returned_results: [Any] = []
        print(base64)
        let image = Utils.convertBase64ToImage(base64)
        if image != nil {
            let results = try? recognizer.recognizeImage(image!)
            print("count:")
            print(results?.count)
            for result in results! {
                returned_results.append(Utils.wrapDLRResult(result:result))
            }
        }
        return returned_results
    }
    
    @objc public func updateRuntimeSettings(_ template: String) {
        try? recognizer.initRuntimeSettings(template)
    }
    
    public func loadCustomModel(modelFolder:String,modelFileNames: [String]){
        for model in modelFileNames {
            guard let prototxt = Bundle.main.url(
                forResource: model,
                withExtension: "prototxt",
                subdirectory: modelFolder
            ) else {
                print("model not exist")
                return
            }

            let datapro = try! Data.init(contentsOf: prototxt)
            let txt = Bundle.main.url(forResource: model, withExtension: "txt", subdirectory: modelFolder)
            let datatxt = try! Data.init(contentsOf: txt!)
            let caffemodel = Bundle.main.url(forResource: model, withExtension: "caffemodel", subdirectory: modelFolder)
            let datacaf = try! Data.init(contentsOf: caffemodel!)
            DynamsoftLabelRecognizer.appendCharacterModel(model, prototxtBuffer: datapro, txtBuffer: datatxt, characterModelBuffer: datacaf)
            print("load model %@", model)
        }
    }
    
    @objc public func resetRuntimeSettings() {
        try? recognizer.resetRuntimeSettings()
    }
}
