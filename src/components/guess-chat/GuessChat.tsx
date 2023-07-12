import React, { useEffect, useState } from "react";
import "./GuessChat.css";
import { socket } from "../../socket";

interface IProps {
  playersTurn: boolean;
}

interface chatMessageProps {
  message: string;
  correct: boolean;
  playerName: string;
}

export default function GuessChat({ playersTurn }: IProps) {
  const [guess, setGuess] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<chatMessageProps[]>([]);
  const [canGuess, setCanGuess] = useState<boolean>(true);

  socket.on("message_update", (message: chatMessageProps) => {
    setChatMessages([...chatMessages, message]);
  });

  socket.on("correct_answer", () => {
    setCanGuess(false);
  });

  useEffect(() => {
    if (playersTurn) {
      setCanGuess(false);
    }
  }, [playersTurn]);

  function sendGuess() {
    if (guess.length <= 0) return;
    socket.emit("send_guess", guess);
    setGuess("");
  }

  return (
    <div className="guess-chat-main-container">
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <h2>Guess Word</h2>
        <div className="chat-box">
          <div className="chat-feed">
            {chatMessages.map((message, index) => (
              <div
                className="chat-message"
                style={{
                  background: index % 2 === 0 ? "rgb(237, 237, 237)" : "white",
                  color: message.correct ? "green" : "black",
                }}
              >
                {message.correct ? (
                  <b>
                    {message.playerName}: {message.message}
                  </b>
                ) : (
                  <>
                    {message.playerName}: {message.message}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="input-bar">
          <input
            type="text"
            onChange={(ev) => setGuess(ev.target.value)}
            value={guess}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" && !playersTurn) {
                sendGuess();
              }
            }}
          />
          <button
            style={{
              background: !canGuess ? "rgb(237, 237, 237)" : "rgb(97, 97, 238)",
            }}
            onClick={() => canGuess && sendGuess()}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}
