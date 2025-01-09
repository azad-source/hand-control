import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./App.module.scss";
import { getDetector } from "./utils/detector";
import { Camera } from "./utils/camera";
import {
  getIndexFingerTip,
  isThumbTouchingIndex,
  lerp,
} from "./helpers/hand.helpers";
import { HandDetector, Keypoint } from "@tensorflow-models/hand-pose-detection";
import PenIcon from "./assets/pen-svgrepo-com.svg";

let detector: HandDetector;

const canvasWidth = 1024;
const canvasHeight = 640;
const cursorSize = 25;
const cursorXmax = canvasWidth / 2 - cursorSize;
const cursorXmin = -canvasWidth / 2;
const cursorYmax = canvasHeight / 2 - cursorSize;
const cursorYmin = -canvasHeight / 2;
const scaleFactor = 6; // Чувствительность курсора
const lerpFactor = 0.15; // Коэффициент плавности курсора

const penImage = new Image();
penImage.src = PenIcon;

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prevCursorParams = useRef<Keypoint | null>(null);

  const [cursorParams, setCursorParams] = useState<Keypoint>();
  const [start, setStart] = useState(false);

  const lerpPosition = useCallback((targetX: number, targetY: number) => {
    currentPosition.current = {
      x: lerp(currentPosition.current.x, targetX, lerpFactor),
      y: lerp(currentPosition.current.y, targetY, lerpFactor),
    };
    return currentPosition.current;
  }, []);

  const drawCursor = useCallback((x: number, y: number, color: string) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    clearCanvas();

    if (penImage.complete) {
      // Рисуем ручку
      const penWidth = cursorSize;
      const penHeight = cursorSize * (penImage.height / penImage.width); // Сохраняем пропорции
      // penImage.style.color = color;
      ctx.drawImage(penImage, x, y, penWidth, penHeight);
      drawPointer(x, y, color);
    } else {
      // Если изображение еще не загрузилось, рисуем резервный квадрат
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cursorSize, cursorSize);
    }
  }, []);

  const drawPointer = (x: number, y: number, color: string) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const radius = 3; // Радиус круга

    ctx.beginPath();
    ctx.arc(x, y + cursorSize, radius, 0, 2 * Math.PI); // Рисуем круг
    ctx.fillStyle = color; // Задаем цвет
    ctx.fill(); // Заполняем круг
  };

  const updateCursorParams = useCallback((newParams: Keypoint) => {
    if (
      JSON.stringify(prevCursorParams.current) !== JSON.stringify(newParams)
    ) {
      prevCursorParams.current = newParams;
      setCursorParams(newParams);
    }
  }, []);

  useEffect(() => {
    if (!start) return;

    const init = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      ctxRef.current = ctx;

      const camera = await Camera.setupCamera(videoRef.current, {
        x: canvasWidth,
        y: canvasHeight,
      });

      detector = await getDetector();

      if (ctx) {
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
      }

      const detectHands = async () => {
        if (camera?.video) {
          const hands = await detector.estimateHands(camera.video, {
            flipHorizontal: false,
          });

          const indexFingerTip = getIndexFingerTip(hands || []);

          if (indexFingerTip) {
            updateCursorParams(indexFingerTip);

            const x = (canvasWidth / 2 - indexFingerTip.x) * scaleFactor;
            const y = (indexFingerTip.y - canvasHeight / 2) * scaleFactor;

            const clampedX = Math.min(Math.max(x, cursorXmin), cursorXmax);
            const clampedY = Math.min(Math.max(y, cursorYmin), cursorYmax);

            const newPos = lerpPosition(clampedX, clampedY);
            const color = isThumbTouchingIndex(hands) ? "red" : "green";

            drawCursor(newPos.x, newPos.y, color);
          }
        }

        requestAnimationFrame(detectHands);
      };

      detectHands();
    };

    init();

    return () => {
      stopCamera();
      clearCanvas();
    };
  }, [start]);

  const clearCanvas = () => {
    if (ctxRef.current) {
      ctxRef.current.clearRect(
        -canvasWidth,
        -canvasHeight,
        2 * canvasWidth,
        2 * canvasHeight
      );
    }
  };

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

  const stop = () => {
    stopCamera();
    clearCanvas();
    ctxRef.current?.reset();
  };

  return (
    <div className={styles.root}>
      <div className={styles.nav}>
        <button onClick={() => setStart(true)}>Start</button>
        <button onClick={stop}>Stop</button>
      </div>
      <div className={styles.content}>
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            playsInline
            style={{
              width: "300px",
              height: "480px",
              transform: "scaleX(-1)",
              // display: "none",
            }}
          ></video>
          <pre>{JSON.stringify(cursorParams, null, 2)}</pre>
        </div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className={styles.canvas}
        />
      </div>
    </div>
  );
}

export default App;
