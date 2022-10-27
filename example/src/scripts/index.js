import '../styles/index.scss';
import { Capacitor } from '@capacitor/core';
import { CameraPreview } from "capacitor-plugin-dynamsoft-camera-preview";
import { LabelRecognizer  } from "capacitor-plugin-dynamsoft-label-recognizer";

console.log('webpack starterkit');
document.getElementsByClassName("decode-image-file")[0].addEventListener("change", decodeImage);
document.getElementsByClassName("start-camera")[0].addEventListener("click", startCamera);
document.getElementsByClassName("capture-button")[0].addEventListener("click", capture);
document.getElementsByClassName("use-case")[0].addEventListener("change", changeUseCase);

const leftPercent = 0;
const widthPercent = 100;
const topPercent = 35;
const heightPercent = 15;
let interval;
let decoding = false;
let correctButton = document.getElementById("correctButton");
correctButton.onclick = function(){
  var modal = document.getElementById("modal");
  modal.className = modal.className.replace("active", "");
  stopWithLiveScanResults();
};

let rescanButton = document.getElementById("rescanButton");
rescanButton.onclick = function(){
  var modal = document.getElementById("modal");
  modal.className = modal.className.replace("active", "");
  startLiveScan();
};


window.onload = async function(){
  let privateTrial;
  if (Capacitor.isNativePlatform()) {
    privateTrial = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAwMjI3NzYzLVRYbE5iMkpwYkdWUWNtOXFYMlJzY2ciLCJvcmdhbml6YXRpb25JRCI6IjEwMDIyNzc2MyIsImNoZWNrQ29kZSI6LTE4MDg2NTM3MjV9";
  }else{
    privateTrial = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAwMjI3NzYzLVRYbFhaV0pRY205cVgyUnNjZyIsIm9yZ2FuaXphdGlvbklEIjoiMTAwMjI3NzYzIiwiY2hlY2tDb2RlIjotNTI2ODU2NjYxfQ==";
  }
  document.getElementById("main").style.display = "none";
  //let publicTrial = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
  await LabelRecognizer.initLicense({license:privateTrial});
  await LabelRecognizer.initialize();
  if (Capacitor.isNativePlatform() === false) {
    LabelRecognizer.addListener('onResourcesLoadStarted', () => {
      document.getElementById("status").innerText = "Loading resources...";
    });
    LabelRecognizer.addListener('onResourcesLoaded', () => {
      document.getElementById("status").innerText = "";
    });
  }
  await CameraPreview.requestCameraPermission();
  await CameraPreview.initialize();
  await CameraPreview.setScanRegion(
    {region:
      {
       left: leftPercent,
       top: topPercent,
       right: leftPercent + widthPercent,
       bottom: topPercent + heightPercent,
       measuredByPercentage:1
      }
    });
  document.getElementById("main").style.display = "";
  document.getElementById("initilization-status").style.display = "none";
};

function decodeImage(){
  let files = document.getElementsByClassName("decode-image-file")[0].files;
  if (files.length == 0) {
    return;
  }
  let img = document.getElementsByClassName("targetImg")[0];
  img.src = "";
  let file = files[0];
  let fileReader = new FileReader();
  fileReader.onload = async function(e){
    img.src = e.target.result;
    let results = await recognizeBase64String(e.target.result);
    displayResults(results);
  };
  fileReader.onerror = function () {
    console.warn('oops, something went wrong.');
  };
  fileReader.readAsDataURL(file);
}

async function recognizeBase64String(base64){
  document.getElementById("status").innerText = "decoding...";
  let response = await LabelRecognizer.recognizeBase64String({base64:base64});
  document.getElementById("status").innerText = "";
  let results = response.results;
  return results;
}

function displayResults(results, cropped){
  if (cropped) {
    let img = document.getElementsByClassName("targetImg")[0];
    img.src = cropped;
  }
  let resultList = document.getElementsByClassName("result-list")[0];
  resultList.innerHTML = "";
  for (const result of results) {    
    console.log(result);
    let text = "";
    for (const lineResult of result.lineResults) {
      text = text + lineResult.text + "\n";
    }
    text = text.trim();
    let pre = document.createElement("pre");
    pre.innerText = text;
    let li = document.createElement("li");
    li.appendChild(pre);
    resultList.appendChild(li);
  }
}

async function startCamera(){
  document.getElementById("main").style.display = "none";
  document.getElementById("camera-container").style.display = "block";

  await CameraPreview.startCamera();
  if (document.getElementById("livemode").checked) {
    startLiveScan();
  }
}

function startLiveScan(){
  decoding = false;
  interval = setInterval(liveScan,500);
}

function stopLiveScan(){
  clearInterval(interval);
}

async function liveScan(){
  if (decoding === true) {
    return;
  }
  if (document.getElementById("modal").className.indexOf("active") != -1) {
    return;
  }
  let result;
  try {
    result = await CameraPreview.takeSnapshot({quality:50});
    let dataURL = "data:image/jpeg;base64,"+result.base64;
    decoding = true;
    if (Capacitor.getPlatform() === "ios") {
      dataURL = await regenerateDataURLWithCanvas(dataURL);
    }
    let results = await recognizeBase64String(dataURL);
    if (results.length>0) {
      stopLiveScan();
      displayResults(results, dataURL);
      displayConfirmationModal(results);
    }
  } catch (error) {
    console.log(error);
  }
  decoding = false;
}

function displayConfirmationModal(results){
  let text = "";
  for (let result of results) {
    for (let lineResult of result.lineResults) {
      text = text + lineResult.text + "\n";
    }
  }
  document.getElementById("result").innerText = text;
  document.getElementById("modal").className += " active";
}

function stopWithLiveScanResults(){
  CameraPreview.stopCamera();
  document.getElementById("main").style.display = "";
  document.getElementById("camera-container").style.display = "none";
}


async function capture(){
  try {
    const result = await CameraPreview.takeSnapshot({quality:50});
    let dataURL = "data:image/jpeg;base64,"+result.base64;
    let img = document.getElementsByClassName("targetImg")[0];
    img.src = dataURL;
    await CameraPreview.stopCamera();
    document.getElementById("main").style.display = "";
    document.getElementById("camera-container").style.display = "none";
    if (Capacitor.getPlatform() === "ios") {
      dataURL = await regenerateDataURLWithCanvas(dataURL);
    }
    let results = await recognizeBase64String(dataURL);
    displayResults(results,dataURL);
  } catch (error) {
    console.log(error);
  }
}

function regenerateDataURLWithCanvas(dataURL){
  console.log("regenerate DataURL");
  return new Promise(function (resolve, reject) {
    try {
      let img = document.createElement("img");
      img.onload = function() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img); 
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.src = dataURL;  
    } catch (error) {
      reject(error);
    }
  });
}

async function changeUseCase(event){
  const index = event.target.selectedIndex;
  if (index === 0) {
    await LabelRecognizer.resetRuntimeSettings();
  }else{
    await loadMRZSettings();
  }
}

async function loadMRZSettings(){
  if (Capacitor.isNativePlatform() === false) {
    await LabelRecognizer.updateRuntimeSettings({settings:{template:"MRZ"}});
  }else{
    await LabelRecognizer.updateRuntimeSettings(
      {
        settings:
        {
          template: "{\"CharacterModelArray\":[{\"DirectoryPath\":\"\",\"Name\":\"MRZ\"}],\"LabelRecognizerParameterArray\":[{\"Name\":\"default\",\"ReferenceRegionNameArray\":[\"defaultReferenceRegion\"],\"CharacterModelName\":\"MRZ\",\"LetterHeightRange\":[5,1000,1],\"LineStringLengthRange\":[30,44],\"LineStringRegExPattern\":\"([ACI][A-Z<][A-Z<]{3}[A-Z0-9<]{9}[0-9][A-Z0-9<]{15}){(30)}|([0-9]{2}[(01-12)][(01-31)][0-9][MF<][0-9]{2}[(01-12)][(01-31)][0-9][A-Z<]{3}[A-Z0-9<]{11}[0-9]){(30)}|([A-Z<]{0,26}[A-Z]{1,3}[(<<)][A-Z]{1,3}[A-Z<]{0,26}<{0,26}){(30)}|([ACIV][A-Z<][A-Z<]{3}([A-Z<]{0,27}[A-Z]{1,3}[(<<)][A-Z]{1,3}[A-Z<]{0,27}){(31)}){(36)}|([A-Z0-9<]{9}[0-9][A-Z<]{3}[0-9]{2}[(01-12)][(01-31)][0-9][MF<][0-9]{2}[(01-12)][(01-31)][0-9][A-Z0-9<]{8}){(36)}|([PV][A-Z<][A-Z<]{3}([A-Z<]{0,35}[A-Z]{1,3}[(<<)][A-Z]{1,3}[A-Z<]{0,35}<{0,35}){(39)}){(44)}|([A-Z0-9<]{9}[0-9][A-Z<]{3}[0-9]{2}[(01-12)][(01-31)][0-9][MF<][0-9]{2}[(01-12)][(01-31)][0-9][A-Z0-9<]{14}[A-Z0-9<]{2}){(44)}\",\"MaxLineCharacterSpacing\":130,\"TextureDetectionModes\":[{\"Mode\":\"TDM_GENERAL_WIDTH_CONCENTRATION\",\"Sensitivity\":8}],\"Timeout\":9999}],\"LineSpecificationArray\":[{\"BinarizationModes\":[{\"BlockSizeX\":30,\"BlockSizeY\":30,\"Mode\":\"BM_LOCAL_BLOCK\",\"MorphOperation\":\"Close\"}],\"LineNumber\":\"\",\"Name\":\"defaultTextArea->L0\"}],\"ReferenceRegionArray\":[{\"Localization\":{\"FirstPoint\":[0,0],\"SecondPoint\":[100,0],\"ThirdPoint\":[100,100],\"FourthPoint\":[0,100],\"MeasuredByPercentage\":1,\"SourceType\":\"LST_MANUAL_SPECIFICATION\"},\"Name\":\"defaultReferenceRegion\",\"TextAreaNameArray\":[\"defaultTextArea\"]}],\"TextAreaArray\":[{\"Name\":\"defaultTextArea\",\"LineSpecificationNameArray\":[\"defaultTextArea->L0\"]}]}",
          customModelConfig:{
            customModelFolder:"MRZ",
            customModelFileNames:["MRZ"]
          }
        }
      }
    );
  }
}
