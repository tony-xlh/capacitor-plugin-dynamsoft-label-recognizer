import { WebPlugin } from '@capacitor/core';
import { DLRResult, LabelRecognizer } from 'dynamsoft-label-recognizer';

import type { LabelRecognizerPlugin } from './definitions';

export class LabelRecognizerWeb extends WebPlugin implements LabelRecognizerPlugin {
  private recognizer: LabelRecognizer | null = null;
  private engineResourcesPath: string = "https://cdn.jsdelivr.net/npm/dynamsoft-label-recognizer@2.2.11/dist/";
  private license: string = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
  async setEngineResourcesPath(options: { path: string; }): Promise<void> {
    this.engineResourcesPath = options.path;
  }
  
  async init(): Promise<void> {
    try {
      LabelRecognizer.license = this.license;
      LabelRecognizer.engineResourcePath = this.engineResourcesPath;
      this.setupEvents();
      this.recognizer = await LabelRecognizer.createInstance();  
    } catch (error) {
      throw error;
    }
  }

  async initLicense(options: { license: string; }): Promise<void> {
    this.license = options.license;
  }
  async recognizeBase64String(options: { base64: string; }): Promise<{results:DLRResult[]}> {
    if (this.recognizer) {
      const results = await this.recognizer.recognizeBase64String(options.base64);
      return {results:results};
    }else{
      throw new Error("Not initialized");
    }
  }

  setupEvents() {
    LabelRecognizer.onResourcesLoadStarted = (resourcePath) => {
        // In this event handler, you can display a visual cue to show that the model file is being downloaded.
        console.log("Loading " + resourcePath);
        this.notifyListeners("onPlayed",resourcePath);
    };
    LabelRecognizer.onResourcesLoaded = (resourcePath) => {
        // In this event handler, you can close the visual cue if it was displayed.
        console.log("Finished loading " + resourcePath);
        this.notifyListeners("onResourcesLoaded", resourcePath);
    };
  }
}
