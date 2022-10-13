import { WebPlugin } from '@capacitor/core';
import { DLRResult, LabelRecognizer } from 'dynamsoft-label-recognizer';

import type { LabelRecognizerPlugin } from './definitions';

export class LabelRecognizerWeb extends WebPlugin implements LabelRecognizerPlugin {
  private recognizer: LabelRecognizer | null = null;
  async setEngineResourcesPath(options: { path: string; }): Promise<void> {
    LabelRecognizer.engineResourcePath = options.path;
  }
  async init(): Promise<void> {
    this.recognizer = await LabelRecognizer.createInstance();
  }
  async initLicense(options: { license: string; }): Promise<void> {
    LabelRecognizer.license = options.license;
  }
  async recognizeBase64String(options: { base64: string; }): Promise<DLRResult[]> {
    if (this.recognizer) {
      return await this.recognizer.recognizeBase64String(options.base64);
    }else{
      throw new Error("Not initialized");
    }
  }
}
