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
* [`setEngineResourcesPath(...)`](#setengineresourcespath)
* [Interfaces](#interfaces)

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


### setEngineResourcesPath(...)

```typescript
setEngineResourcesPath(options: { path: string; }) => Promise<void>
```

| Param         | Type                           |
| ------------- | ------------------------------ |
| **`options`** | <code>{ path: string; }</code> |

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

</docgen-api>
