# capacitor-plugin-dynamsoft-label-recognizer

Capacitor plugin of Dynamsoft Label Recognizer which brings text recognition ability to your apps.

## Install

```bash
npm install capacitor-plugin-dynamsoft-label-recognizer
npx cap sync
```

## API

<docgen-index>

* [`init()`](#init)
* [`initLicense(...)`](#initlicense)
* [`recognizeBase64String(...)`](#recognizebase64string)
* [`updateRuntimeSettingsFromString(...)`](#updateruntimesettingsfromstring)
* [`setEngineResourcesPath(...)`](#setengineresourcespath)
* [`addListener('onResourcesLoadStarted', ...)`](#addlisteneronresourcesloadstarted)
* [`addListener('onResourcesLoaded', ...)`](#addlisteneronresourcesloaded)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### init()

```typescript
init() => Promise<void>
```

--------------------


### initLicense(...)

```typescript
initLicense(options: { license: string; }) => Promise<void>
```

| Param         | Type                              |
| ------------- | --------------------------------- |
| **`options`** | <code>{ license: string; }</code> |

--------------------


### recognizeBase64String(...)

```typescript
recognizeBase64String(options: { base64: string; }) => Promise<{ results: DLRResult[]; }>
```

| Param         | Type                             |
| ------------- | -------------------------------- |
| **`options`** | <code>{ base64: string; }</code> |

**Returns:** <code>Promise&lt;{ results: DLRResult[]; }&gt;</code>

--------------------


### updateRuntimeSettingsFromString(...)

```typescript
updateRuntimeSettingsFromString(options: { template: string; }) => Promise<void>
```

| Param         | Type                               |
| ------------- | ---------------------------------- |
| **`options`** | <code>{ template: string; }</code> |

--------------------


### setEngineResourcesPath(...)

```typescript
setEngineResourcesPath(options: { path: string; }) => Promise<void>
```

| Param         | Type                           |
| ------------- | ------------------------------ |
| **`options`** | <code>{ path: string; }</code> |

--------------------


### addListener('onResourcesLoadStarted', ...)

```typescript
addListener(eventName: 'onResourcesLoadStarted', listenerFunc: onResourcesLoadStartedListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'onResourcesLoadStarted'</code>                                                     |
| **`listenerFunc`** | <code><a href="#onresourcesloadstartedlistener">onResourcesLoadStartedListener</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addListener('onResourcesLoaded', ...)

```typescript
addListener(eventName: 'onResourcesLoaded', listenerFunc: onResourcesLoadedListener) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'onResourcesLoaded'</code>                                                |
| **`listenerFunc`** | <code><a href="#onresourcesloadedlistener">onResourcesLoadedListener</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

--------------------


### Interfaces


#### DLRResult

| Prop              | Type                                                          |
| ----------------- | ------------------------------------------------------------- |
| **`location`**    | <code><a href="#dlrquadrilateral">DLRQuadrilateral</a></code> |
| **`confidence`**  | <code>number</code>                                           |
| **`lineResults`** | <code>DLRLineResult[]</code>                                  |


#### DLRQuadrilateral

| Prop         | Type                    |
| ------------ | ----------------------- |
| **`points`** | <code>DLRPoint[]</code> |


#### DLRPoint

| Prop    | Type                |
| ------- | ------------------- |
| **`x`** | <code>number</code> |
| **`y`** | <code>number</code> |


#### DLRLineResult

| Prop                      | Type                                                          |
| ------------------------- | ------------------------------------------------------------- |
| **`text`**                | <code>string</code>                                           |
| **`location`**            | <code><a href="#dlrquadrilateral">DLRQuadrilateral</a></code> |
| **`confidence`**          | <code>number</code>                                           |
| **`isCheckDigitMatched`** | <code>boolean</code>                                          |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


### Type Aliases


#### onResourcesLoadStartedListener

<code>(resourcePath: string): void</code>


#### onResourcesLoadedListener

<code>(resourcePath: string): void</code>

</docgen-api>
