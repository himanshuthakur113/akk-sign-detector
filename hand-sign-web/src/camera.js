const video = document.getElementById("kvid");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");

let webcam_stream;

async function startCamera()
{
    webcam_stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: "user", height: 480, width: 640}});
    video.srcObject = webcam_stream;
}

function stopCamera()
{
    for(const track of webcam_stream.getTracks())
    {
        track.stop();
    }
    video.srcObject = null;
    webcam_stream = null;
}

startBtn.addEventListener("click",startCamera);
stopBtn.addEventListener("click",stopCamera);