import '../styles/index.scss';
import { CameraPreview } from "@capacitor-community/camera-preview";
import { Capacitor } from '@capacitor/core';
import { LabelRecognizer  } from "capacitor-plugin-dynamsoft-label-recognizer";

console.log('webpack starterkit');
document.getElementsByClassName("decode-image-file")[0].addEventListener("change", decodeImage);
document.getElementsByClassName("scan")[0].addEventListener("click", scan);
document.getElementsByClassName("capture-button")[0].addEventListener("click", capture);

window.onload = async function(){
  await LabelRecognizer.initLicense({license:"DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="});
  await LabelRecognizer.init();
};

function decodeImage(){
  let files = document.getElementsByClassName("decode-image-file")[0].files;
  if (files.length == 0) {
    return;
  }
  let img = document.getElementsByClassName("img")[0];
  img.src = "";
  let file = files[0];
  let fileReader = new FileReader();
  fileReader.onload = function(e){
    img.src = e.target.result;
    recognizeBase64String(e.target.result);
  };
  fileReader.onerror = function () {
    console.warn('oops, something went wrong.');
  };
  fileReader.readAsDataURL(file);
}

async function recognizeBase64String(base64){
  console.log(base64);
  let response = await LabelRecognizer.recognizeBase64String({base64:base64});
  let results = response.results;
  console.log(results);
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

async function scan(){
  document.getElementById("main").style.display = "none";
  document.getElementById("camera-container").style.display = "block";
  let svg = document.getElementsByClassName("overlay")[0];
  svg.innerHTML = "";
  await CameraPreview.start({
    width: 1280,
    height: 720,
    parent:"camera-container",
    position:'rear'});
  if (Capacitor.isNativePlatform() === false) {
    setTimeout(getPreviewSizeToUpdateOverlay,7000); //wait for the camera to open
  }else{
    getPreviewSizeToUpdateOverlay();
  }
}

async function capture(){
  const result = await CameraPreview.captureSample({});
  let fullImage = document.createElement("img");
  fullImage.onload = function(){
    let cropped = cropImage(fullImage,0.15,0.35,0.70,0.15);
    let img = document.getElementsByClassName("img")[0];
    img.src = cropped;
    console.log(cropped);
    CameraPreview.stop();
    document.getElementById("main").style.display = "";
    document.getElementById("camera-container").style.display = "none";
    recognizeBase64String(cropped);
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
  let img = document.getElementsByClassName("img")[0];
  img.src = "data:image/jpeg;base64,"+result.value;
  img.onload = function (){
    updateOverlay(img.naturalWidth,img.naturalHeight);
  };
}

function updateOverlay(width,height){
  let svg = document.getElementsByClassName("overlay")[0];
  svg.innerHTML = "";
  let rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
  rect.setAttribute("x",width*0.15);
  rect.setAttribute("y",height*0.35);
  rect.setAttribute("width",width*0.70);
  rect.setAttribute("height",height*0.15);
  svg.setAttribute("viewBox","0 0 "+width+" "+height);
  svg.appendChild(rect);
}
