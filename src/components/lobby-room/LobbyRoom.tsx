import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import "./LobbyRoom.css";
import { BiCopyAlt } from "react-icons/bi";
import { socket } from "../../socket";

interface IProps {
  isHost: boolean;
  roundsToPlay: number;
  setRoundsToPlay: React.Dispatch<React.SetStateAction<number>>;
}
export default function LobbyRoom({
  isHost,
  roundsToPlay,
  setRoundsToPlay,
}: IProps) {
  const { playersInLobby, lobbyId } = useContext(AppContext);

  function startGame() {
    if (isHost) {
      socket.emit("start_game", lobbyId);
    }
  }

  function copyLobbyId() {
    navigator.clipboard.writeText(lobbyId);
  }

  function changeRoundAmount(amount: number) {
    if (!isHost) return;
    setRoundsToPlay((prev) => prev + amount);
  }
  useEffect(() => {
    if (roundsToPlay !== 0 && isHost) {
      socket.emit("change_round_amount", {
        lobbyId: lobbyId,
        amount: roundsToPlay,
      });
    }
  }, [roundsToPlay]);
  return (
    <div className="lobby-room-main-container">
      <div
        className={
          isHost
            ? "lobby-side-container character-customization"
            : "gray-filter lobby-side-container character-customization"
        }
      >
        <h1>character customization</h1>
      </div>
      <div className="lobby-room-container">
        <h1>Lobby Room</h1>
        <div className="lobby-room-player-list">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="player-grid">
              {playersInLobby?.map((player) => (
                <div className="lobby-player-card">
                  <div className="player-character"></div>
                  <h3>{player.playerName}</h3>
                </div>
              ))}
            </div>
          </div>
          <div className="invite-code-container">
            <div className="lobby-code">
              {lobbyId}
              <div onClick={() => copyLobbyId()}>
                <BiCopyAlt
                  style={{
                    color: "white",
                    width: "70%",
                    height: "70%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isHost && (
            <button className="play-button" onClick={startGame}>
              PLAY
            </button>
          )}
        </div>
      </div>
      <div
        className={
          isHost
            ? "lobby-side-container lobby-settings"
            : "gray-filter lobby-side-container lobby-settings"
        }
      >
        <h1>Lobby options</h1>
        <label>round:</label>
        <div className="rounds-to-play-container">
          <button onClick={() => changeRoundAmount(-1)}> &#60; </button>
          <span>{roundsToPlay}</span>
          <button onClick={() => changeRoundAmount(1)}> &#62; </button>
        </div>
      </div>
    </div>
  );
}
