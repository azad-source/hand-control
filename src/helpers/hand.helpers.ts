import { Hand, Keypoint } from "@tensorflow-models/hand-pose-detection";

enum IndexFingerPoints {
  index_finger_mcp = "index_finger_mcp", // 5
  index_finger_pip = "index_finger_pip", // 6
  index_finger_dip = "index_finger_dip", // 7
  index_finger_tip = "index_finger_tip", // 8
}

export function getIndexFingerTip(hands?: Hand[]): Keypoint | undefined {
  return hands?.[0]?.keypoints.find(
    (k) => k.name === IndexFingerPoints.index_finger_tip
  );
}
