import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";

export default function ProjectionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [c, setC] = useState<CanvasRenderingContext2D>();

  const canvasDataQueue = [];
  let isProcessingCanvasData = false;

  socket.on("canvas_data", (imgData) => {
    if (!isProcessingCanvasData) {
      isProcessingCanvasData = true;
      processCanvasData(imgData);
    } else {
      canvasDataQueue.push(imgData);
    }
  });

  useEffect(() => {
    if (canvas) {
      const _c = canvas.getContext("2d")!;
      setC(_c);
      canvas.width = 1000;
      canvas.height = 700;
    }
  }, [canvas]);

  useEffect(() => {
    setCanvas(canvasRef.current!);
  }, []);

  useEffect(() => {
    if (!canvas || !c) return;
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
  }, [c]);

  function processCanvasData(imgData) {
    const img = new Image();
    img.onload = () => {
      c?.drawImage(img, 0, 0, canvas!.width, canvas!.height);

      if (canvasDataQueue.length > 0) {
        const nextImgData = canvasDataQueue.shift();
        processCanvasData(nextImgData);
      } else {
        isProcessingCanvasData = false;
      }
    };
    img.src = imgData;
  }
  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      ></canvas>
    </div>
  );
}
