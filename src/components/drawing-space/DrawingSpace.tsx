import { socket } from "../../socket";
import { useEffect, useState, useRef } from "react";

interface DrawPointsProps {
  x: number;
  y: number;
  color: string;
  size: number;
  endPoint: boolean;
}

interface IProps {
  activeColor: string;
  penWidth: number;
}

export default function DrawingSpace({
  activeColor = "black",
  penWidth = 2,
}: IProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [c, setC] = useState<CanvasRenderingContext2D>();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [allDrawPoints, setAllDrawPoints] = useState<DrawPointsProps[]>([]);

  const [pointMax, setPointMax] = useState<number>(0);
  const [pointIter, setPointIter] = useState<number>(0);
  const [releasedMouse, setReleasedMouse] = useState<boolean>(false);
  const [pressedMouse, setPressedMouse] = useState<boolean>(false);

  const [isCanvasHovered, setIsCanvasHovered] = useState(false);

  const sendMessage = () => {
    socket.emit("send_message", { message: "Hello" });
  };

  socket.on("connect", () => {});

  socket.on("point_update", (points) => {
    setAllDrawPoints(points);
  });

  useEffect(() => {
    if (!canvas && !c) return;
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
    mouseController();
  }, [c]);

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

  function mouseController() {
    if (!canvas) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setMousePosition({
        x: x,
        y: y,
      });
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
      setPressedMouse(true);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      setReleasedMouse(true);
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
      canvas.addEventListener("mouseenter", handleMouseEnter);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    };
  }

  function draw() {
    if (!canvas || !c) return;

    if (releasedMouse && pressedMouse) {
      const newPoint = {
        x: mousePosition.x,
        y: mousePosition.y,
        color: activeColor,
        size: penWidth,
        endPoint: true,
      };
      socket.emit("add_point", [...allDrawPoints, newPoint]);
      setReleasedMouse(false);
      setPressedMouse(false);
    }

    if (isMouseDown && mousePosition) {
      if (pointIter <= pointMax) {
        setPointIter((prev) => prev + 1);
        return;
      }

      const newPoint = {
        x: mousePosition.x,
        y: mousePosition.y,
        color: activeColor,
        size: penWidth,
        endPoint: false,
      };
      socket.emit("add_point", [...allDrawPoints, newPoint]);

      setPointIter(0);
    }
  }

  function smoothDrawPoints() {
    if (!c) return;

    for (let i = 0; i < allDrawPoints.length; i++) {
      if (allDrawPoints[i + 1] && !allDrawPoints[i].endPoint) {
        c.strokeStyle = allDrawPoints[i].color;
        c.lineWidth = allDrawPoints[i].size * 2;
        c.beginPath();
        c.moveTo(allDrawPoints[i].x, allDrawPoints[i].y);
        // c.lineTo(allDrawPoints[i + 1].x, allDrawPoints[i + 1].y);
        // c.stroke();
        const controlPointX = (allDrawPoints[i].x + allDrawPoints[i + 1].x) / 2;
        const controlPointY = (allDrawPoints[i].y + allDrawPoints[i + 1].y) / 2;
        c.quadraticCurveTo(
          controlPointX,
          controlPointY,
          allDrawPoints[i + 1].x,
          allDrawPoints[i + 1].y
        );
        c.stroke();
      }

      c.fillStyle = allDrawPoints[i].color;
      c.beginPath();
      c.arc(
        allDrawPoints[i].x,
        allDrawPoints[i].y,
        allDrawPoints[i].size,
        0,
        Math.PI * 2
      );
      c.fill();
    }
  }

  useEffect(() => {
    draw();
    //draw cursor:
  }, [mousePosition]);

  useEffect(() => {
    smoothDrawPoints();
  }, [allDrawPoints]);
  return (
    <div>
      <div
        className="draw-window"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
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
  );
}
