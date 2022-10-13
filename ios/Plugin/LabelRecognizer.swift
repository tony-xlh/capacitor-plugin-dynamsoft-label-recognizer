import Foundation

@objc public class LabelRecognizer: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
