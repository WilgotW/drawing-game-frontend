import React, { useContext, useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import PenOptions from "../pen-options/PenOptions";
import WordPopup from "../word-popup/WordPopup";
import { AppContext } from "../../context/AppContext";

interface IProps {
  playersTurn: boolean;
  activeColor: string;
  penWidth: number;
  revealingWord: string;
  randomWords: string[];
}
export default function CanvasDrawing({
  playersTurn,
  activeColor,
  penWidth,
  revealingWord,
  randomWords,
}: IProps) {
  const { lobbyId } = useContext(AppContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [c, setC] = useState<CanvasRenderingContext2D>();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const latestMousePositionRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isCanvasHovered, setIsCanvasHovered] = useState(false);

  const startPos = useRef({ x: 0, y: 0 });

  // //determines how fast client send canvas data. Higher number can lower lag but decreases drawing accuracy for clients.
  // const canvasDataSpeed = 3;
  // const [dataSendCount, setDataSendCount] = useState<number>();

  socket.on("canvas_data", (imgData) => {
    const img = new Image();
    img.onload = () => {
      c?.drawImage(img, 0, 0, canvas!.width, canvas!.height);
    };
    img.src = imgData;
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

  useEffect(() => {
    if (playersTurn) {
      mouseController();
    }
  }, [playersTurn]);

  useEffect(() => {
    if (!playersTurn) return;
    if (isMouseDown) {
      startPos.current = latestMousePositionRef.current;
      animationRef.current = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationRef.current!);
      animationRef.current = null;
      c?.stroke();
      c?.beginPath();
    }
  }, [isMouseDown]);

  useEffect(() => {
    if (!isCanvasHovered) {
      setIsMouseDown(false);
    }
  }, [isCanvasHovered]);

  function sendCanvasData() {
    const imgData = canvas?.toDataURL();
    socket.emit("canvas_data", {
      imgData: imgData,
      lobbyId: lobbyId,
    });
  }

  function draw() {
    if (!c || !canvas) return;
    const { x, y } = latestMousePositionRef.current;

    c.strokeStyle = activeColor;
    c.lineWidth = penWidth * 2;
    c.lineCap = "round";

    if (startPos.current) {
      const { x: startX, y: startY } = startPos.current;
      c.beginPath();
      c.moveTo(startX, startY);
      c.lineTo(x, y);
      c.stroke();
      startPos.current = { x, y };
    }

    sendCanvasData();

    if (isMouseDown) {
      animationRef.current = requestAnimationFrame(draw);
    }
  }

  function clearCanvas() {
    c!.fillStyle = "white";
    c!.fillRect(0, 0, canvas!.width, canvas!.height);
    sendCanvasData();
  }

  function mouseController() {
    if (!canvas) return;

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setMousePosition({
        x: x,
        y: y,
      });
      latestMousePositionRef.current = {
        x: x,
        y: y,
      };
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    const handleMouseEnter = () => {
      setIsCanvasHovered(true);
    };

    const handleMouseLeave = () => {
      setIsCanvasHovered(false);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }

  return (
    <>
      <div>
        <div
          className="draw-window"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          {playersTurn && !revealingWord && (
            <WordPopup randomWords={randomWords} />
          )}
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%" }}
          ></canvas>
          {isCanvasHovered && (
            <div
              className="mouse-follower"
              style={{
                border: "solid black 1px",
                position: "absolute",
                top: mousePosition.y + 4,
                left: mousePosition.x + 6,
                width: `${penWidth * 2}px`,
                height: `${penWidth * 2}px`,
                borderRadius: "50%",
                background: activeColor,
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          )}
        </div>
      </div>
      {playersTurn && <PenOptions clearCanvas={clearCanvas} />}
    </>
  );
}
