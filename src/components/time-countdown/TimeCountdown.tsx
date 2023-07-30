import React, { useContext, useEffect, useState } from "react";
import { socket } from "../../socket";
import { FaBeer } from "react-icons/fa";
import "./TimeCountdown.css";
import { AppContext } from "../../context/AppContext";

interface IProps {
  playersTurn: boolean;
  roundsToPlay: number;
  currentRound: number;
}

export default function TimeCountdown({
  playersTurn,
  roundsToPlay,
  currentRound,
}: IProps) {
  const { lobbyId } = useContext(AppContext);
  const [timeLeft, setTimeLeft] = useState<number>(50);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  socket.on("end_round", () => {
    setTimeLeft(50);
    setRotationAngle(0);
  });
  useEffect(() => {
    socket.on("time_update", (time: number) => {
      setTimeLeft(time);
      setRotationAngle(360 - time * 7.2);
    });
  }, []);

  useEffect(() => {
    if (!playersTurn) return;
    if (timeLeft <= 0) {
      setTimeLeft(50);
      socket.emit("time_over", lobbyId);
    }
  }, [timeLeft]);

  return (
    <div className="time-countdown-main-container">
      <div className="time-countdown-container">
        <div className="time-clock">
          <div className="clock-bell bell1"></div>
          <div className="clock-bell bell2"></div>

          <div className="clock-stand stand1"></div>
          <div className="clock-stand stand2"></div>
          <div className="clock-dial-container">
            <div
              className="clock-dial"
              style={{
                transform: `rotate(${rotationAngle}deg)`,
              }}
            ></div>
          </div>
        </div>
        <h1
          className="time-count"
          style={{ color: timeLeft <= 10 ? "red" : "white" }}
        >
          {timeLeft}
        </h1>
        <span>
          round: {currentRound} / {roundsToPlay}
        </span>
      </div>
    </div>
  );
}
