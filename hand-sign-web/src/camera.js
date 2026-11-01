import { initDetector, detect } from "./detector.js";
import { drawHand } from "./ui.js";
import { classify } from "./classifier.js";

const video = document.getElementById("kvid");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");
const canvas = document.querySelector("canvas");
const label = document.getElementById("label");

let webcam_stream;
let handLandmarker = null;
let animationId = null;

async function startCamera()
{
    try
    {
    webcam_stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: "user", height: 480, width: 640}});
    video.srcObject = webcam_stream;
    status.textContent = "Camera Started. Loading Model...";

    handLandmarker = await initDetector();
    status.textContent = "Camera and Hand detector ready";

    function loop()
    {   
        if(!webcam_stream)
        {
            return;
        }

        if(video.readyState >= 2)
        {
        const result = detect(video);
        console.log(result);

        drawHand(canvas, result);
        const sign = classify(result);
        label.textContent = sign ?? "Show your hand";
        console.log(sign);
        }

        animationId = requestAnimationFrame(loop);
    }

    animationId = requestAnimationFrame(loop);
    }
    catch(error)
    {
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

        stopCamera();
    }
}

function stopCamera()
{   
    if(!webcam_stream)
    {
        status.textContent = "No Video Found";
        return;
    }

    for(const track of webcam_stream.getTracks())
    {
        track.stop();
    }
    video.srcObject = null;
    webcam_stream = null;
    status.textContent = "Camera Stopped";
}

startBtn.addEventListener("click",startCamera);
stopBtn.addEventListener("click",stopCamera);