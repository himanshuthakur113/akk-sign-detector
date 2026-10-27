const video = document.getElementById("kvid");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");

let webcam_stream;

async function startCamera()
{
    try
    {
    webcam_stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: "user", height: 480, width: 640}});
    video.srcObject = webcam_stream;
    status.textContent = "Camera Started Successfully";
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