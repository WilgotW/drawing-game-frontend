import React, { useContext, useEffect, useState } from "react";
import { socket } from "../../socket";
import { FaBeer } from "react-icons/fa";
import "./TimeCountdown.css";
import { AppContext } from "../../context/AppContext";

interface IProps {
  playersTurn: boolean;
}

export default function TimeCountdown({ playersTurn }: IProps) {
  const { lobbyId } = useContext(AppContext);
  const [timeLeft, setTimeLeft] = useState<number>(50);

  useEffect(() => {
    socket.on("time_update", (time: number) => {
      setTimeLeft(time);
    });
  }, []);

  useEffect(() => {
    if (!playersTurn) return;
    if (timeLeft <= 0) {
      setTimeLeft(50);
      socket.emit("time_over", lobbyId);
    }
  }, [timeLeft, playersTurn, lobbyId]);

  const rotationAngle = 360 - timeLeft * 7.2;

  return (
    <div className="time-countdown-main-container">
      <div className="time-clock">
        <div className="clock-dial-container">
          <div
            className="clock-dial"
            style={{
              transform: `rotate(${rotationAngle}deg)`,
            }}
          ></div>
        </div>
      </div>
      <h1>{timeLeft}</h1>
    </div>
  );
}
