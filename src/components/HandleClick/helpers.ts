import { Hand, Keypoint } from "@tensorflow-models/hand-pose-detection";

enum HandLandmarks {
  Wrist = "wrist", // 0
  ThumbCmc = "thumb_cmc", // 1
  ThumbMcp = "thumb_mcp", // 2
  ThumbIp = "thumb_ip", // 3
  ThumbTip = "thumb_tip", // 4
  IndexFingerMcp = "index_finger_mcp", // 5
  IndexFingerPip = "index_finger_pip", // 6
  IndexFingerDip = "index_finger_dip", // 7
  IndexFingerTip = "index_finger_tip", // 8
  MiddleFingerMcp = "middle_finger_mcp", // 9
  MiddleFingerPip = "middle_finger_pip", // 10
  MiddleFingerDip = "middle_finger_dip", // 11
  MiddleFingerTip = "middle_finger_tip", // 12
  RingFingerMcp = "ring_finger_mcp", // 13
  RingFingerPip = "ring_finger_pip", // 14
  RingFingerDip = "ring_finger_dip", // 15
  RingFingerTip = "ring_finger_tip", // 16
  PinkyFingerMcp = "pinky_finger_mcp", // 17
  PinkyFingerPip = "pinky_finger_pip", // 18
  PinkyFingerDip = "pinky_finger_dip", // 19
  PinkyFingerTip = "pinky_finger_tip", // 20
}

const fingerPointsNum: Record<HandLandmarks, number> = {
  [HandLandmarks.Wrist]: 0,
  [HandLandmarks.ThumbCmc]: 1,
  [HandLandmarks.ThumbMcp]: 2,
  [HandLandmarks.ThumbIp]: 3,
  [HandLandmarks.ThumbTip]: 4,
  [HandLandmarks.IndexFingerMcp]: 5,
  [HandLandmarks.IndexFingerPip]: 6,
  [HandLandmarks.IndexFingerDip]: 7,
  [HandLandmarks.IndexFingerTip]: 8,
  [HandLandmarks.MiddleFingerMcp]: 9,
  [HandLandmarks.MiddleFingerPip]: 10,
  [HandLandmarks.MiddleFingerDip]: 11,
  [HandLandmarks.MiddleFingerTip]: 12,
  [HandLandmarks.RingFingerMcp]: 13,
  [HandLandmarks.RingFingerPip]: 14,
  [HandLandmarks.RingFingerDip]: 15,
  [HandLandmarks.RingFingerTip]: 16,
  [HandLandmarks.PinkyFingerMcp]: 17,
  [HandLandmarks.PinkyFingerPip]: 18,
  [HandLandmarks.PinkyFingerDip]: 19,
  [HandLandmarks.PinkyFingerTip]: 20,
};

export function getIndexFingerTip(hands?: Hand[]): Keypoint | undefined {
  return hands?.[0]?.keypoints[fingerPointsNum[HandLandmarks.IndexFingerTip]];
}

function getThumbFingerTip(hands?: Hand[]): Keypoint | undefined {
  return hands?.[0]?.keypoints[fingerPointsNum[HandLandmarks.ThumbTip]];
}

export function isThumbTouchingIndex(hands?: Hand[]) {
  const thumbFinger = getThumbFingerTip(hands);
  const indexFinger = getIndexFingerTip(hands);

  const tolearnce = 40;

  if (thumbFinger && indexFinger) {
    const xDif = Math.abs(thumbFinger.x - indexFinger.x);
    const yDif = Math.abs(thumbFinger.y - indexFinger.y);

    return xDif <= tolearnce && yDif <= tolearnce;
  }

  return false;
}

export function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor;
}
