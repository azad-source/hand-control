export class Camera {
  public video: HTMLVideoElement | null = null;

  constructor(videoElm?: HTMLVideoElement) {
    this.video = videoElm || <HTMLVideoElement>document.getElementById("video");
  }

  static async setupCamera(
    videoElm?: HTMLVideoElement,
    size?: { x: number; y: number }
  ) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        "Browser API navigator.mediaDevices.getUserMedia not available"
      );
    }

    const videoConfig = {
      audio: false,
      video: {
        facingMode: "user",
        width: size?.x || 640,
        height: size?.y || 480,
        frameRate: { ideal: 25 },
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

    const camera = new Camera(videoElm);

    const _video = camera.video;

    if (_video) {
      _video.srcObject = stream;

      await new Promise((resolve) => {
        _video.onloadedmetadata = () => {
          resolve(_video);
        };
      });

      _video.play();

      return camera;
    }
  }
}
