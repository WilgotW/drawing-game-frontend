import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { socket } from "../../socket";

export default function Menu() {
  const [lobbyInput, setLobbyInput] = useState<string>("");
  const { setUserName, userName, setPlayersInLobby, playersInLobby } =
    useContext(AppContext);

  const [lobbyId, setLobbyId] = useState<string>("");

  socket.on("lobby_msg", (msg) => console.log(msg));

  socket.on();

  function createLobby() {
    socket.emit("create_lobby", userName);
  }
  function joinLobby() {
    console.log("lobby input: " + lobbyInput);
    socket.emit("join_lobby", { lobbyId: lobbyInput, userName: userName });
  }

  function sendToLobby() {
    socket.emit("send_to_lobby", userName);
  }
  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Menu</h1>
      {playersInLobby && (
        <>
          {playersInLobby?.map((player) => (
            <h3>{player.playerName}</h3>
          ))}
        </>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          margin: "20px",
        }}
      >
        <input
          placeholder="username"
          type="text"
          onChange={(ev) => setUserName(ev.target.value)}
          value={userName}
        />
        <input
          placeholder="lobby id"
          type="text"
          onChange={(ev) => setLobbyInput(ev.target.value)}
          value={lobbyInput}
        />
        <button onClick={() => createLobby()}>create lobby</button>
        <button onClick={() => joinLobby()}>join lobby</button>
        <button onClick={() => sendToLobby()}>sc</button>
      </div>
    </div>
  );
}
