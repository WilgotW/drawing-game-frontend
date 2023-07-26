import React, { useContext } from "react";
import "./PlayerList.css";
import { AppContext } from "../../context/AppContext";
export default function PlayersList() {
  const { playersInLobby, thisPlayersId } = useContext(AppContext);
  return (
    <div className="player-list-main-container">
      {playersInLobby.map((player) => (
        <div
          className={
            player.playersTurn
              ? "player-card players-turn"
              : player.correctGuess
              ? "player-card correct"
              : "player-card"
          }
        >
          <div className="player-profile"></div>
          <>
            <div style={{ width: "fit-content", display: "flex", gap: "5px" }}>
              {player.playerName}
              <div>{player.playerId === thisPlayersId && <b> [you]</b>}</div>
            </div>
          </>

          <span>score: {player.score}</span>
        </div>
      ))}
    </div>
  );
}
