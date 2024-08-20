import { PluginListenerHandle } from "@capacitor/core";
import { DLRResult } from "dynamsoft-label-recognizer";

export interface LabelRecognizerPlugin {
  initialize(): Promise<void>;
  initLicense(options: { license: string }): Promise<void>;
  recognizeBase64String(options: { base64: string }): Promise<{results:DLRResult[]}>;
  /**
  * Android and iOS only method which directly read camera frames from capacitor-plugin-dynamsoft-camera-preview
  */
  recognizeBitmap(): Promise<{results:DLRResult[]}>;
  updateRuntimeSettings(options: {settings:RuntimeSettings}): Promise<void>;
  resetRuntimeSettings(): Promise<void>;
  setEngineResourcesPath(options: { path: string }): Promise<void>;
  addListener(
    eventName: 'onResourcesLoadStarted',
    listenerFunc: onResourcesLoadStartedListener,
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: 'onResourcesLoaded',
    listenerFunc: onResourcesLoadedListener,
  ): Promise<PluginListenerHandle>;
  removeAllListeners(): Promise<void>;
}

export type onResourcesLoadStartedListener = (resourcePath:string) => void;
export type onResourcesLoadedListener = (resourcePath:string) => void;


export interface RuntimeSettings {
  template: string;
  customModelConfig?: CustomModelConfig;
}

export interface CustomModelConfig {
  customModelFolder: string;
  customModelFileNames: string[];
}