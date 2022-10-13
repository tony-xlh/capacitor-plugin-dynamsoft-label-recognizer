import '../styles/index.scss';
import { CameraPreview } from "@capacitor-community/camera-preview";
import { LabelRecognizer  } from "capacitor-plugin-dynamsoft-label-recognizer";

console.log('webpack starterkit');
document.getElementsByClassName("decode-image-file")[0].addEventListener("change", decodeImage);
document.getElementsByClassName("scan")[0].addEventListener("click", scan);
document.getElementsByClassName("capture-button")[0].addEventListener("click", capture);

window.onload = function(){
  LabelRecognizer.init();
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
  let results = await LabelRecognizer.recognizeBase64String({base64:base64});
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

function scan(){
  document.getElementById("main").style.display = "none";
  document.getElementById("camera-container").style.display = "block";
  CameraPreview.start({parent:"camera-container"});
}

async function capture(){
  const result = await CameraPreview.capture({});
  CameraPreview.stop();
  console.log(result);
  document.getElementById("main").style.display = "";
  document.getElementById("camera-container").style.display = "none";
  let img = document.getElementsByClassName("img")[0];
  img.src = "data:image/jpeg;base64,"+result.value;
  recognizeBase64String(result.value);
}