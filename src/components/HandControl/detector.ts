import {
  createDetector,
  MediaPipeHandsMediaPipeModelConfig,
  MediaPipeHandsTfjsModelConfig,
  SupportedModels,
} from "@tensorflow-models/hand-pose-detection";
import * as mpHands from "@mediapipe/hands";

export async function getDetector() {
  const model = SupportedModels.MediaPipeHands;

  const detectorConfig:
    | MediaPipeHandsMediaPipeModelConfig
    | MediaPipeHandsTfjsModelConfig = {
    runtime: "mediapipe", // or 'tfjs',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}`,
    modelType: "full",
  };
  return await createDetector(model, detectorConfig);
}
