import { HandLandmarker, FilesetResolver } from "../assets/mediapipe/vision_bundle.mjs";

let handLandmarker = null;

export async function initDetector() 
{
    const vision = await FilesetResolver.forVisionTasks("../assets/mediapipe/wasm");
    
    handLandmarker = await HandLandmarker.createFromOptions(
        vision,
        {
            baseOptions: 
            {
                modelAssetPath: "../assets/models/hand_landmarker.task",
                delegate: "GPU"
            },
            runningMode: "VIDEO",
            numHands: 1
        }
    );

    console.log("Hand detector ready");
    return handLandmarker;
}

export async function detect()
{

}