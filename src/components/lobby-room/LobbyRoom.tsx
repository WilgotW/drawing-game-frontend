import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import "./LobbyRoom.css";
import { BiCopyAlt } from "react-icons/bi";
import { socket } from "../../socket";
import body from "../../assets/body.png";
import head1 from "../../assets/parts/head1.png";
import head2 from "../../assets/parts/head2.png";
import head3 from "../../assets/parts/head3.png";
import head4 from "../../assets/parts/head4.png";
import eye1 from "../../assets/parts/eyes1.png";
import eye2 from "../../assets/parts/eyes2.png";
import eye3 from "../../assets/parts/eyes3.png";
import eye4 from "../../assets/parts/eyes4.png";
interface IProps {
  isHost: boolean;
  roundsToPlay: number;
  setRoundsToPlay: React.Dispatch<React.SetStateAction<number>>;
  timePerGame: number;
  setTimePerGame: React.Dispatch<React.SetStateAction<number>>;
}

type ImageType = string;
const headImages: ImageType[] = [head1, head2, head3, head4];
const eyeImages: ImageType[] = [eye1, eye2, eye3, eye4];

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

  const [headCustomizations, setHeadCustomizations] =
    useState<ImageType[]>(headImages);
  const [selectedHead, setSelectedHead] = useState<number>(0);

  const [eyeCustomizations, setEyeCustomizations] =
    useState<ImageType[]>(eyeImages);
  const [selectedEye, setSelectedEye] = useState<number>(0);

  useEffect(() => {
    if (roundsToPlay !== 0 && isHost) {
      socket.emit("change_round_amount", {
        lobbyId: lobbyId,
        amount: roundsToPlay,
      });
    }
  }, [roundsToPlay]);

  function saveCustomization() {
    socket.emit("save_customization", {
      lobbyId: lobbyId,
      playerId: thisPlayersId,
      head: selectedHead,
      eye: selectedEye,
    });
  }

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
        <div className="player-customization-part-container">
          <div
            style={{ top: "90px" }}
            className="switch-customization-part-buttons"
          >
            <button
              onClick={() =>
                selectedHead > 0 && setSelectedHead((prev) => prev - 1)
              }
            >
              {" "}
              &#60;
            </button>
            <button
              onClick={() =>
                selectedHead < headCustomizations.length - 1 &&
                setSelectedHead((prev) => prev + 1)
              }
            >
              &#62;
            </button>
          </div>
          <div
            style={{ top: "150px" }}
            className="switch-customization-part-buttons"
          >
            <button
              onClick={() =>
                selectedEye > 0 && setSelectedEye((prev) => prev - 1)
              }
            >
              {" "}
              &#60;
            </button>
            <button
              onClick={() =>
                selectedEye < eyeCustomizations.length - 1 &&
                setSelectedEye((prev) => prev + 1)
              }
            >
              &#62;
            </button>
          </div>
          <div className="lobby-player-body">
            <img className="lobby-player-body-img" src={body} alt="" />
          </div>
          <div className="head-customizations">
            <img
              className={`lobby-head-img-${selectedHead}`}
              src={headCustomizations[selectedHead]}
              alt=""
            />
          </div>
          <div style={{ top: "120px" }} className="eye-customizations">
            <img
              className={`lobby-eye-img-${selectedEye}`}
              src={eyeCustomizations[selectedEye]}
              alt=""
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              bottom: "0px",
              width: "100%",
            }}
          >
            <button
              onClick={saveCustomization}
              className="save-cutomizations-btn"
            >
              save
            </button>
          </div>
        </div>
      </div>
      <div className="lobby-room-container">
        <h1>Lobby Room</h1>
        <div className="lobby-room-player-list">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="player-grid">
              {playersInLobby?.map((player) => (
                <div className="lobby-player-card">
                  <div className="player-card-body">
                    <img src={body} alt="" />
                  </div>
                  <div className="head-customizations">
                    <img
                      className={`lobby-head-img-${player.customizations.head}-card`}
                      src={headCustomizations[player.customizations.head]}
                      alt=""
                    />
                  </div>
                  <div style={{ top: "65px" }} className="eye-customizations">
                    <img
                      className={`lobby-eye-img-${player.customizations.eye}-card`}
                      src={eyeCustomizations[player.customizations.eye]}
                      alt=""
                    />
                  </div>

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
