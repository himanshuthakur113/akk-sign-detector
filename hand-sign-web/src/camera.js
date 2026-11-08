import { initDetector, detect } from "./detector.js";
import { drawHand } from "./ui.js";
import { classify } from "./classifier.js";
import { createSmoother } from "./smoother.js";
import { speak } from "./ui.js";
import { loadModel, predictSign, extractFeatures } from "./mlPredictor.js";

const video = document.getElementById("kvid");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");
const canvas = document.querySelector("canvas");
const label = document.getElementById("label");
const soundToggle = document.getElementById("soundToggle");
const flipBtn = document.getElementById("flipBtn");

let webcam_stream;
let handLandmarker = null;
let animationId = null;
let smoother = createSmoother(15);
let lastSpoken = null;
let facingMode = "user";

const testLandmarks = Array.from(
    {length: 21},
    () => ({x:0.5, y:0.6, z:0})
);

const features = extractFeatures(testLandmarks);
console.log("features:", features);
console.log(features.length);
function loop()
{   
    if(!webcam_stream || document.hidden)
    {
        return;
    }

    if(video.readyState >= 2)
    {
        const result = detect(video);
        //console.log(result);

        drawHand(canvas, result);

        const sign = classify(result);
        //console.log(sign);

        const stableSign = smoother.update(sign);
        label.textContent = stableSign ?? "Show your hand";

        if(!stableSign)
        {
            lastSpoken = null;
        }

        if(soundToggle.checked && stableSign != lastSpoken)
        {
            speak(stableSign);
            lastSpoken = stableSign;
        } 
    }
    animationId = requestAnimationFrame(loop);
}

async function startCamera()
{
    if(webcam_stream) return;

    startBtn.disabled = true;
    stopBtn.disabled = true;

    try
    {
        webcam_stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: facingMode, height: 480, width: 640}});
        video.srcObject = webcam_stream;
        flipBtn.disabled = false;
        stopBtn.disabled = false;
        status.textContent = "Camera Started. Loading Model...";

        handLandmarker = await initDetector();
        if(!webcam_stream) return;

        status.textContent = "Camera and Hand detector ready";

        if(!document.hidden)
        {
            animationId = requestAnimationFrame(loop);
        }
    }
    catch(error)
    {   
        stopCamera();
        if(error.name === "NotAllowedError")
        {
            status.textContent = "User Denied Premission";
        }
        else if(error.name === "NotFoundError")
        {
            status.textContent = "No Camera Found";
        }
        else
        {
            status.textContent = "Error Occured " + error.message;
        }

    }
}

function stopCamera()
{   
    if(animationId !== null)
    {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if(webcam_stream)
    {
        for(const track of webcam_stream.getTracks())
        {
        track.stop();
        }
        video.srcObject = null;
        webcam_stream = null;
    }

    smoother = createSmoother(15);

    drawHand(canvas, null);
    label.textContent = "";
    status.textContent = "Camera Stopped";

    lastSpoken = null;
    speechSynthesis.cancel();

    startBtn.disabled = false;
    stopBtn.disabled = true;
    flipBtn.disabled = true;
}

async function flipCamera()
{
    if(!webcam_stream) return;
    for(const track of webcam_stream.getTracks())
    {
        track.stop();
    }

    video.srcObject = null;
    webcam_stream = null;

    facingMode = facingMode === "user"? "environment" : "user";
    await startCamera();
}

startBtn.addEventListener("click",startCamera);
stopBtn.addEventListener("click",stopCamera);
flipBtn.addEventListener("click", flipCamera);
document.addEventListener("visibilitychange", ()=> 
{
    if(document.hidden)
    {   
        if(animationId !== null)
        {
            cancelAnimationFrame(animationId);
            animationId = null;
        }    
    }
    else
    {
        if(webcam_stream && animationId === null)
        {
            animationId = requestAnimationFrame(loop);
        }
    }

});

video.addEventListener("loadedmetadata", ()=> 
{
    canvas.width= video.videoWidth;
    canvas.height = video.videoHeight;
});
