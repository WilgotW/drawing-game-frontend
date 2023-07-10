import React from "react";
import "./GuessChat.css";
export default function GuessChat() {
  return (
    <div className="guess-chat-main-container">
      <h2>Guess Word</h2>
      <div className="chat-box">
        <div className="chat-feed"></div>
        <input type="text" />
        <button>send</button>
      </div>
    </div>
  );
}
