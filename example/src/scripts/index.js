import '../styles/index.scss';
import { CameraPreview } from "@capacitor-community/camera-preview";
import { Capacitor } from '@capacitor/core';
import { LabelRecognizer  } from "capacitor-plugin-dynamsoft-label-recognizer";

console.log('webpack starterkit');
document.getElementsByClassName("decode-image-file")[0].addEventListener("change", decodeImage);
document.getElementsByClassName("start-camera")[0].addEventListener("click", startCamera);
document.getElementsByClassName("capture-button")[0].addEventListener("click", capture);
document.getElementsByClassName("use-case")[0].addEventListener("change", changeUseCase);

const leftPercent = 0.0;
const widthPercent = 1.0;
const topPercent = 0.35;
const heightPercent = 0.15;
let interval;
let decoding = false;

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

function displayResults(results){
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
  let svg = document.getElementsByClassName("overlay")[0];
  svg.innerHTML = "";
  let options = {
    toBack: true,
    parent:"camera-container",
    position:'rear'
  };
  if (Capacitor.isNativePlatform() === false) {
    options.width = 1280;
    options.height = 720;
  }
  await CameraPreview.start(options);
  if (Capacitor.isNativePlatform() === false) {
    setTimeout(getPreviewSizeToUpdateOverlay,7000); //wait for the camera to open
  }else{
    getPreviewSizeToUpdateOverlay();
  }
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
  const result = await CameraPreview.captureSample({});
  let fullImage = document.createElement("img");
  fullImage.onload = async function(){
    let cropped = cropImage(fullImage,leftPercent,topPercent,widthPercent,heightPercent);
    let results = await recognizeBase64String(cropped);
    if (results.length>0) {
      stopLiveScan();
      displayResults(results);
      CameraPreview.stop();
      let img = document.getElementsByClassName("targetImg")[0];
      img.src = cropped;
      document.getElementById("main").style.display = "";
      document.getElementById("camera-container").style.display = "none";
    }
    decoding = false;
  };
  decoding = true;
  fullImage.src = "data:image/jpeg;base64,"+result.value;
}

async function capture(){
  const result = await CameraPreview.captureSample({});
  let fullImage = document.createElement("img");
  fullImage.onload = async function(){
    let cropped = cropImage(fullImage,leftPercent,topPercent,widthPercent,heightPercent);
    let img = document.getElementsByClassName("img")[0];
    img.src = cropped;
    console.log(cropped);
    CameraPreview.stop();
    document.getElementById("main").style.display = "";
    document.getElementById("camera-container").style.display = "none";
    let results = await (cropped);
    displayResults(results);
  };
  fullImage.src = "data:image/jpeg;base64,"+result.value;
}

function cropImage(img, left, top, width, height){
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  let SX = img.naturalWidth * left;
  let SY = img.naturalHeight * top;
  let SWIDTH = img.naturalWidth * width;
  let SHEIGHT = img.naturalHeight * height;
  let DX = 0;
  let DY = 0;
  let DWIDTH = SWIDTH;
  let DHEIGHT = SHEIGHT;
  canvas.width = DWIDTH;
  canvas.height = DHEIGHT;
  console.log(canvas.width);
  console.log(canvas.height);
  ctx.drawImage(img, SX, SY, SWIDTH, SHEIGHT, DX, DY, DWIDTH, DHEIGHT); 
  return canvas.toDataURL('image/jpeg');
}

async function getPreviewSizeToUpdateOverlay(){
  const result = await CameraPreview.capture({});
  console.log(result);
  let img = document.getElementsByClassName("targetImg")[0];
  img.src = "data:image/jpeg;base64,"+result.value;
  img.onload = function (){
    updateOverlay(img.naturalWidth,img.naturalHeight);
  };
}

function updateOverlay(width,height){
  let svg = document.getElementsByClassName("overlay")[0];
  svg.innerHTML = "";
  let rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
  rect.setAttribute("x",width*leftPercent);
  rect.setAttribute("y",height*topPercent);
  rect.setAttribute("width",width*widthPercent);
  rect.setAttribute("height",height*heightPercent);
  svg.setAttribute("viewBox","0 0 "+width+" "+height);
  svg.appendChild(rect);
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
