import React, { useState, useContext } from "react";
import { socket } from "../../socket";
import "./EndRoundSummary.css";
import { AppContext } from "../../context/AppContext";

export default function EndRoundSummary() {
  const { correctWord, playersInLobby } = useContext(AppContext);

  return (
    <div className="end-round-summary-container">
      <div
        style={{
          width: "100%",
          height: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <h1>{correctWord} was the correct word!</h1>
          <div className="players-score-summary">
            {playersInLobby?.map((player) => (
              <div className="player-summary-stats">
                <span
                  style={{
                    color: player.thisRoundsScore > 0 ? "green" : "red",
                  }}
                >
                  {player.thisRoundsScore > 0 ? (
                    <>+{player.thisRoundsScore}</>
                  ) : (
                    <>{player.thisRoundsScore}</>
                  )}
                </span>
                <span>{player.playerName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
