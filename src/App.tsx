import { useEffect, useRef, useState } from "react";
import "./App.module.scss";
import { getDetector } from "./utils/detector";
import { Camera } from "./utils/camera";
import { getIndexFingerTip } from "./helpers/hand.helpers";
import { HandDetector } from "@tensorflow-models/hand-pose-detection";

let camera: Camera | undefined;
let detector: HandDetector;
let ctx: CanvasRenderingContext2D | null | undefined;

const canvasWidth = 640;
const canvasHeight = 480;
const cursorSize = 50;
const cursorXmax = canvasWidth - cursorSize;
const cursorYmax = canvasHeight - cursorSize;

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const canvas = canvasRef.current;
  ctx = canvas?.getContext("2d");

  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!start) return;

    const init = async () => {
      if (videoRef.current) {
        camera = await Camera.setupCamera(videoRef.current);
      }

      detector = await getDetector();

      const detectHands = async () => {
        if (camera?.video) {
          const hands = await detector.estimateHands(camera.video, {
            flipHorizontal: false,
          });

          const indexFingerTip = getIndexFingerTip(hands || []);

          if (indexFingerTip) {
            if (!ctx) return;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Рисуем квадрат
            ctx.fillStyle = "green";

            const x = canvasWidth - indexFingerTip.x;
            const y = indexFingerTip.y;

            const xPos = x < 0 ? 0 : x > cursorXmax ? cursorXmax : x;
            const yPos = y < 0 ? 0 : y > cursorYmax ? cursorYmax : y;

            ctx.fillRect(xPos, yPos, cursorSize, cursorSize);
          }
        }

        requestAnimationFrame(detectHands);
      };

      detectHands();
    };

    init();

    return () => {
      // Очищаем ресурсы
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream)?.getTracks();
        tracks?.forEach((track) => track.stop());
      }
      setStart(false);
    };
  }, [start]);

  const stopCamera = () => {
    const videoElement = videoRef.current;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
    setStart(false);
  };

  return (
    <div>
      <button onClick={() => setStart(true)}>Start</button>
      <button onClick={stopCamera}>Stop</button>
      <video
        ref={videoRef}
        playsInline
        style={{
          width: "100%",
          height: "100%",
          transform: "scaleX(-1)",
          display: "none",
        }}
      ></video>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "1px solid red" }}
      />
    </div>
  );
}

export default App;
