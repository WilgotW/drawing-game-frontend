import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { socket } from "../../socket";

interface PlayerProps {
  playerName: string;
  playerId: string;
  playersTurn: boolean;
  joinedLobbyId: string;
}

interface LobbyProps {
  players: PlayerProps[];
  lobbyId: string;
}

export default function Menu() {
  const [lobbyInput, setLobbyInput] = useState<string>("");
  const { setUserName, userName } = useContext(AppContext);

  const [lobbyData, setLobbyData] = useState<LobbyProps>({
    players: [],
    lobbyId: "",
  });

  socket.on("lobby_msg", (msg) => console.log(msg));

  socket.on("lobby_update", (updatedLobby: LobbyProps) => {
    console.log(updatedLobby.players);

    // setLobbyData({
    //   players: updatedLobby.players,
    //   lobbyId: updatedLobby.lobbyId,
    // });
  });

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
      {lobbyData && (
        <>
          {lobbyData?.players?.map((player) => (
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
