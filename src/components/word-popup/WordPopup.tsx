import React from "react";
import { socket } from "../../socket";
import "./WordPopup.css";
interface IProps {
  randomWords: string[];
}

export default function WordPopup({ randomWords }: IProps) {
  function selectWord(word: string) {
    socket.emit("set_word", word);
  }

  return (
    <div className="select-word-container">
      <div
        style={{
          width: "100%",
          height: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="word-selection-buttons">
          <h1>Select A Word to Draw!</h1>
          <div style={{ display: "flex", gap: "20px", margin: "20px" }}>
            <button
              className="word-select-button"
              onClick={() => selectWord(randomWords[0])}
            >
              {randomWords[0]}
            </button>
            <button
              className="word-select-button"
              onClick={() => selectWord(randomWords[1])}
            >
              {randomWords[1]}
            </button>
            <button
              className="word-select-button"
              onClick={() => selectWord(randomWords[2])}
            >
              {randomWords[2]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
