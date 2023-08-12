import { useContext, useEffect, useState } from "react";
import { socket } from "../../socket";
import "./TimeCountdown.css";
import { AppContext } from "../../context/AppContext";
import clockSound from "../../sounds/clock-sound.wav";
import playSound from "../../functions/playSound";

interface IProps {
  playersTurn: boolean;
  roundsToPlay: number;
  currentRound: number;
  timePerGame: number;
}

export default function TimeCountdown({
  playersTurn,
  roundsToPlay,
  currentRound,
  timePerGame,
}: IProps) {
  const { lobbyId } = useContext(AppContext);
  const [timeLeft, setTimeLeft] = useState<number>(50);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  socket.on("end_round", () => {
    setTimeLeft(timePerGame);
    setRotationAngle(0);
  });
  useEffect(() => {
    setTimeLeft(timePerGame);
    socket.on("time_update", (time: number) => {
      setTimeLeft(time);
      setRotationAngle(360 - time * (360 / timePerGame));
    });
  }, []);

  useEffect(() => {
    if (!playersTurn) return;
    if (timeLeft <= 10) {
      playSound(clockSound);
    }
    if (timeLeft <= 0) {
      setTimeLeft(timePerGame);
      socket.emit("time_over", lobbyId);
    }
  }, [timeLeft]);

  return (
    <div className="time-countdown-main-container">
      <div className="time-countdown-container">
        <div
          className={
            timeLeft <= 10
              ? timeLeft % 2 === 0
                ? "time-clock red"
                : "time-clock"
              : "time-clock"
          }
        >
          <div className="clock-bell bell1"></div>
          <div className="clock-bell bell2"></div>

          <div className="clock-stand stand1"></div>
          <div className="clock-stand stand2"></div>
          <>
            <div
              style={{ background: "transparent" }}
              className="clock-dial-container"
            >
              <div
                className="clock-dial"
                style={{
                  transform: `rotate(${rotationAngle}deg)`,
                }}
              ></div>
            </div>
          </>
        </div>
        <h1
          className="time-count"
          style={{
            color:
              timeLeft <= 10 ? (timeLeft % 2 === 0 ? "red" : "white") : "white",
          }}
        >
          {timeLeft}
        </h1>
        <div className="round-container">
          <span>
            round: {currentRound} / {roundsToPlay}
          </span>
        </div>
      </div>
    </div>
  );
}
