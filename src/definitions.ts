import { PluginListenerHandle } from "@capacitor/core";
import { DLRResult } from "dynamsoft-label-recognizer";

export interface LabelRecognizerPlugin {
  init(): Promise<void>;
  initLicense(options: { license: string }): Promise<void>;
  recognizeBase64String(options: { base64: string }): Promise<{results:DLRResult[]}>;
  updateRuntimeSettings(options: {settings:RuntimeSettings}): Promise<void>;
  setEngineResourcesPath(options: { path: string }): Promise<void>;
  addListener(
    eventName: 'onResourcesLoadStarted',
    listenerFunc: onResourcesLoadStartedListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
  addListener(
    eventName: 'onResourcesLoaded',
    listenerFunc: onResourcesLoadedListener,
  ): Promise<PluginListenerHandle> & PluginListenerHandle;
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