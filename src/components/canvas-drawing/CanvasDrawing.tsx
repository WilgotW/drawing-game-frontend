import React, { useContext, useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import PenOptions from "../pen-options/PenOptions";
import WordPopup from "../word-popup/WordPopup";
import { AppContext } from "../../context/AppContext";
import EndRoundPopup from "../EndRoundPopup/EndRoundPopup";

interface IProps {
  playersTurn: boolean;
  activeColor: string;
  penWidth: number;
  revealingWord: string;
  randomWords: string[];
  playerChoosingWord: boolean;
}
export default function CanvasDrawing({
  playersTurn,
  activeColor,
  penWidth,
  revealingWord,
  randomWords,
  playerChoosingWord,
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

  const [sendCount, setSendCount] = useState<number>(0);

  // //determines how fast client send canvas data. Higher number can lower lag but decreases drawing accuracy for clients.
  // const canvasDataSpeed = 3;
  // const [dataSendCount, setDataSendCount] = useState<number>();

  // socket.on("end_round", () => {
  //   if (!c || !canvas) return;
  //   c.fillStyle = "white";
  //   c.fillRect(0, 0, canvas.width, canvas.height);
  // });
  // socket.on("clear_canvas", () => {
  //   if(c && canvas){
  //     c.clearRect(0, 0, canvas.width, canvas.height);
  //   }
  //   setCanvas(undefined);
  //   setC(undefined);
  //   setIsMouseDown(false);
  //   setIsCanvasHovered(false);
  // });

  useEffect(() => {
    if (!playersTurn) {
      animationRef.current = null;
    }
  }, [playersTurn]);

  useEffect(() => {
    if (sendCount >= 2) {
      setSendCount(0);
      sendCanvasData();
    }
  }, [sendCount]);
  socket.on("canvas_data", (imgData) => {
    if (!playersTurn) {
      processData(imgData);
    }
  });

  function processData(imgData) {
    const canvasDataQueue: any = [];
    let isProcessingCanvasData = false;

    if (!isProcessingCanvasData) {
      isProcessingCanvasData = true;
      const img = new Image();
      img.onload = () => {
        c?.drawImage(img, 0, 0, canvas!.width, canvas!.height);

        if (canvasDataQueue.length > 0) {
          const nextImgData = canvasDataQueue.shift();
        } else {
          isProcessingCanvasData = false;
        }
      };
      img.src = imgData;
    } else {
      canvasDataQueue.push(imgData);
    }
  }

  useEffect(() => {
    if (canvas) {
      if (!c) {
        const _c = canvas.getContext("2d")!;
        setC(_c);
        canvas.width = 1000;
        canvas.height = 700;
      }
    }
  }, [canvas]);

  useEffect(() => {
    if (!canvas) {
      setCanvas(canvasRef.current!);
    }
  }, []);

  useEffect(() => {
    if (!canvas || !c) return;
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
  }, [c]);

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
    if (!playersTurn) return;
    const imgData = canvas?.toDataURL();
    socket.emit("canvas_data", {
      imgData: imgData,
      lobbyId: lobbyId,
      playersTurn: playersTurn,
    });
  }

  function draw() {
    if (!c || !canvas || !playersTurn) return;
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

    if (isMouseDown) {
      setSendCount((prev) => prev + 1);
      animationRef.current = requestAnimationFrame(draw);
    }
  }

  function clearCanvas() {
    if (!c || !canvas) return;
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
    sendCanvasData();
  }

  function mouseController() {
    if (!canvas) return;
    let isMounted = true;

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
      sendCanvasData();
    };

    const handleMouseEnter = () => {
      setIsCanvasHovered(true);
    };

    const handleMouseLeave = () => {
      setIsCanvasHovered(false);
      sendCanvasData();
    };

    const setupMouseController = () => {
      canvas?.addEventListener("mousemove", handleMouseMove);
      canvas?.addEventListener("mousedown", handleMouseDown);
      canvas?.addEventListener("mouseup", handleMouseUp);
      canvas?.addEventListener("mouseenter", handleMouseEnter);
      canvas?.addEventListener("mouseleave", handleMouseLeave);
    };

    const cleanupMouseController = () => {
      canvas?.removeEventListener("mousemove", handleMouseMove);
      canvas?.removeEventListener("mousedown", handleMouseDown);
      canvas?.removeEventListener("mouseup", handleMouseUp);
      canvas?.removeEventListener("mouseenter", handleMouseEnter);
      canvas?.removeEventListener("mouseleave", handleMouseLeave);
    };

    if (playersTurn && isMounted) {
      setupMouseController();
    } else {
      cleanupMouseController();
    }

    return () => {
      isMounted = false;
      cleanupMouseController();
    };
  }

  useEffect(() => {
    console.log("this players turn: " + playersTurn);

    mouseController();
  }, [playersTurn, canvas]);

  return (
    <>
      <div>
        <div
          className="draw-window"
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          {playerChoosingWord && (
            <>
              {playersTurn ? (
                <WordPopup randomWords={randomWords} />
              ) : (
                <EndRoundPopup />
              )}
            </>
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
