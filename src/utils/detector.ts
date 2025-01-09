import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import {
  MediaPipeHandsMediaPipeModelConfig,
  MediaPipeHandsTfjsModelConfig,
} from "@tensorflow-models/hand-pose-detection";
import * as mpHands from "@mediapipe/hands";
// import * as tfjsWasm from "@tensorflow/tfjs-backend-wasm";

export async function getDetector() {
  //   tfjsWasm.setWasmPaths(
  //     `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`
  //   );

  const model = handPoseDetection.SupportedModels.MediaPipeHands;

  const detectorConfig:
    | MediaPipeHandsMediaPipeModelConfig
    | MediaPipeHandsTfjsModelConfig = {
    runtime: "mediapipe", // or 'tfjs',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}`,
    modelType: "full",
  };
  return await handPoseDetection.createDetector(model, detectorConfig);
}
