import { DrawingUtils, HandLandmarker } from "../assets/mediapipe/vision_bundle.mjs";

export function drawHand(canvas, landmarks)
{
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(!landmarks)
    {
        return;
    }

    const utils = new DrawingUtils(ctx);

    utils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS,
    {
        color: "#00ff00",
        lineWidth: 3
    }
    );

    utils.drawLandmarks(landmarks,{color: "#ff0000",lineWidth: 2}); 

}