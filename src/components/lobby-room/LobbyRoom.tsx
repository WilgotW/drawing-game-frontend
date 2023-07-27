import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./LobbyRoom.css";
import { BiCopyAlt } from "react-icons/bi";
import { socket } from "../../socket";

export default function LobbyRoom() {
  const { playersInLobby, lobbyId } = useContext(AppContext);

  function startGame() {
    socket.emit("start_game", lobbyId);
  }

  function copyLobbyId() {
    navigator.clipboard.writeText(lobbyId);
  }
  return (
    <div className="lobby-room-main-container">
      <div style={{ display: "flex", flexDirection: "column" }}>
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
          <button className="play-button" onClick={startGame}>
            PLAY
          </button>
        </div>
      </div>
    </div>
  );
}
