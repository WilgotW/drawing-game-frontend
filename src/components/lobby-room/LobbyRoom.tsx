import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import "./LobbyRoom.css";
import { BiCopyAlt } from "react-icons/bi";
import { socket } from "../../socket";

interface IProps {
  isHost: boolean;
  roundsToPlay: number;
  setRoundsToPlay: React.Dispatch<React.SetStateAction<number>>;
  timePerGame: number;
  setTimePerGame: React.Dispatch<React.SetStateAction<number>>;
}
export default function LobbyRoom({
  isHost,
  roundsToPlay,
  setRoundsToPlay,
  timePerGame,
  setTimePerGame,
}: IProps) {
  const { playersInLobby, lobbyId, setUserName, userName, thisPlayersId } =
    useContext(AppContext);

  const roundOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
  ];
  const timeOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 30, label: "30" },
    { value: 40, label: "40" },
    { value: 50, label: "50" },
    { value: 60, label: "60" },
    { value: 70, label: "70" },
    { value: 80, label: "80" },
  ];

  useEffect(() => {
    if (roundsToPlay !== 0 && isHost) {
      socket.emit("change_round_amount", {
        lobbyId: lobbyId,
        amount: roundsToPlay,
      });
    }
  }, [roundsToPlay]);

  function changeUserName() {
    socket.emit("change_username", {
      lobbyId: lobbyId,
      playerId: thisPlayersId,
      userName: userName,
    });
  }

  function startGame() {
    if (isHost) {
      socket.emit("start_game", lobbyId);
    }
  }

  function copyLobbyId() {
    navigator.clipboard.writeText(lobbyId);
  }

  // function changeRoundAmount(amount: number) {
  //   if (!isHost) return;
  //   const am = amount + roundsToPlay;
  //   setRoundsToPlay(am);
  // }
  function changeTimePerGame(_time: number) {
    if (!isHost) return;
    setTimePerGame((prev) => prev + _time);
  }
  useEffect(() => {
    if (timePerGame > 0) {
      socket.emit("change_time_game", {
        lobbyId: lobbyId,
        timePerGame: timePerGame,
      });
    }
  }, [timePerGame]);
  return (
    <div className="lobby-room-main-container">
      <div
        className={
          isHost
            ? "lobby-side-container character-customization-container"
            : "gray-filter lobby-side-container character-customization-container"
        }
      >
        <h1>character customization</h1>

        <div className="player-customization-inputs">
          <label>user name</label>
          <input
            className="player-name-input"
            type="text"
            value={userName}
            onChange={(ev) => setUserName(ev.target.value)}
          />
          <button
            className="customization-btn"
            onClick={() => changeUserName()}
          >
            save
          </button>
        </div>
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
        <div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="rounds-to-play-container">
              <label>rounds: </label>
              <select
                value={roundsToPlay}
                onChange={(ev) => setRoundsToPlay(parseInt(ev.target.value))}
              >
                {roundOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* <button onClick={() => setR(-1)}> &#60; </button>
              <span>{roundsToPlay}</span>
              <button onClick={() => changeRoundAmount(1)}> &#62; </button> */}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="rounds-to-play-container">
              <label>time per game:</label>

              <select
                value={timePerGame}
                onChange={(ev) => setTimePerGame(parseInt(ev.target.value))}
              >
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
