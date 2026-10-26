const video = document.getElementById("kvid");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");

async function startCamera()
{
    const webcam_stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: "user", height: 480, width: 640}});
    video.srcObject = webcam_stream;
}

startBtn.addEventListener("click",startCamera);