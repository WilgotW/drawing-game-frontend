import { socket } from "../../socket";
import { useEffect, useState, useRef, useCallback } from "react";
import { debounce } from "lodash";

interface DrawPointsProps {
  x: number;
  y: number;
  color: string;
  size: number;
  endPoint: boolean;
}

interface IProps {
  playersTurn: boolean;
  activeColor: string;
  penWidth: number;
  doUndo: boolean;
  setDoUndo: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DrawingSpace({
  playersTurn,
  activeColor = "black",
  penWidth = 2,
  doUndo,
  setDoUndo,
}: IProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [c, setC] = useState<CanvasRenderingContext2D>();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [allDrawPoints, setAllDrawPoints] = useState<DrawPointsProps[]>([]);
  const [isCanvasHovered, setIsCanvasHovered] = useState(false);

  const [releasedMouse, setReleasedMouse] = useState<boolean>(false);
  const [pressedMouse, setPressedMouse] = useState<boolean>(false);

  const [alreadyDrawnPoints, setAlreadyDrawnPoints] = useState<
    DrawPointsProps[]
  >([]);

  const debouncedDraw = useCallback(debounce(draw, 10), [mousePosition]);

  const debouncedSmoothDrawPoints = useCallback(
    debounce(smoothDrawPoints, 10),
    [allDrawPoints]
  );

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
    mouseController();
    // if (playersTurn) {
    //   requestAnimationFrame(draw);
    //   requestAnimationFrame(smoothDrawPoints);
    // }
  }, [c]);

  useEffect(() => {
    socket.on("point_update", (points) => {
      setAllDrawPoints((prevPoints) => [...prevPoints, points]);
      setAlreadyDrawnPoints((prevPoints) => [...prevPoints, points]);
    });

    socket.on("point_removed", (newPoints) => {
      setAllDrawPoints(newPoints);
      setAlreadyDrawnPoints(newPoints);
      c.fillStyle = "white";
      c?.fillRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("point_update");
      socket.off("point_removed");
    };
  }, [c, canvas]);

  useEffect(() => {
    if (doUndo) {
      undo();
    }
  }, [doUndo]);

  useEffect(() => {
    if (playersTurn) {
      draw();
      smoothDrawPoints();
    }
  }, [mousePosition]);

  useEffect(() => {
    if (!undo) {
      smoothDrawPoints();
    } else {
      smoothDrawPointsAll();
      setDoUndo(false);
    }
  }, [allDrawPoints]);
  useEffect(() => {
    if (!isCanvasHovered && allDrawPoints.length > 1) {
      let point = allDrawPoints[allDrawPoints.length - 1];
      point.endPoint = true;
      socket.emit("add_point", point);
      setIsMouseDown(false);
    }
  }, [isCanvasHovered]);

  function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
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
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }

  function draw() {
    if (!canvas || !c) return;

    if (isMouseDown && mousePosition) {
      const newPoint = {
        x: mousePosition.x,
        y: mousePosition.y,
        color: activeColor,
        size: penWidth,
        endPoint: false,
      };
      if (
        !alreadyDrawnPoints.some(
          (point) => point.x === newPoint.x && point.y === newPoint.y
        )
      ) {
        socket.emit("add_point", newPoint);
        setAlreadyDrawnPoints((prevPoints) => [...prevPoints, newPoint]);
      }
    }
    if (releasedMouse && pressedMouse) {
      const newPoint = {
        x: mousePosition.x,
        y: mousePosition.y,
        color: activeColor,
        size: penWidth,
        endPoint: true,
      };
      if (
        !alreadyDrawnPoints.some(
          (point) => point.x === newPoint.x && point.y === newPoint.y
        )
      ) {
        socket.emit("add_point", newPoint);
        setAlreadyDrawnPoints((prevPoints) => [...prevPoints, newPoint]);
      }
      setPressedMouse(false);
      setReleasedMouse(false);
    }
    // requestAnimationFrame(draw);
  }

  function smoothDrawPointsAll() {
    if (!c) return;

    for (let i = 0; i < allDrawPoints.length; i++) {
      if (allDrawPoints[i + 1] && !allDrawPoints[i].endPoint) {
        c.strokeStyle = allDrawPoints[i].color;
        c.lineWidth = allDrawPoints[i].size * 2;
        c.beginPath();
        c.moveTo(allDrawPoints[i].x, allDrawPoints[i].y);
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

  function smoothDrawPoints() {
    if (!c || allDrawPoints.length < 2) return;

    const point1 = allDrawPoints[allDrawPoints.length - 2];
    const point2 = allDrawPoints[allDrawPoints.length - 1];

    if (!point1.endPoint) {
      c.strokeStyle = point2.color;
      c.lineWidth = point2.size * 2;
      c.beginPath();
      c.moveTo(point1.x, point1.y);
      c.quadraticCurveTo(
        (point1.x + point2.x) / 2,
        (point1.y + point2.y) / 2,
        point2.x,
        point2.y
      );
      c.stroke();
    } else {
    }

    c.fillStyle = point2.color;
    c.beginPath();
    c.arc(point2.x, point2.y, point2.size, 0, Math.PI * 2);
    c.fill();
  }

  function undo() {
    if (allDrawPoints.length < 1) {
      return;
    }

    let removeAmount: number;
    if (allDrawPoints.length >= 11) {
      removeAmount = 10;
    } else if (allDrawPoints) {
      removeAmount = 1;
    }

    // if (allDrawPoints.length > 1)
    //   removeLast[removeLast.length - 1].endPoint = true;

    socket.emit("point_undo", removeAmount);
  }

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
