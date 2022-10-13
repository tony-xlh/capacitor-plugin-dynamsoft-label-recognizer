import { DLRResult } from "dynamsoft-label-recognizer";

export interface LabelRecognizerPlugin {
  init(): Promise<void>;
  initLicense(options: { license: string }): Promise<void>;
  recognizeBase64String(options: { base64: string }): Promise<DLRResult[]>;
  setEngineResourcesPath(options: { path: string }): Promise<void>;
}
