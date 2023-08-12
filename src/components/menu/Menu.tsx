import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { socket } from "../../socket";
import "./Menu.css";
import logo from "../../assets/Logo.png";
export default function Menu() {
  const [lobbyInput, setLobbyInput] = useState<string>("");
  const { playersInLobby } = useContext(AppContext);
  const [showJoin, setShowJoin] = useState<boolean>(false);

  function createLobby() {
    socket.emit("create_lobby", "player");
  }
  function joinLobby() {
    console.log("lobby input: " + lobbyInput);
    socket.emit("join_lobby", { lobbyId: lobbyInput, userName: "player" });
  }

  return (
    <div>
      <img
        style={{
          width: "450px",
          height: "350px",
          position: "absolute",
          transform: "translateX(-50px) translateY(-50px)",
        }}
        src={logo}
        alt=""
      />
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
          gap: "15px",
          margin: "20px",
          marginTop: "200px",
        }}
      >
        <button className="menu-btn" onClick={() => createLobby()}>
          create lobby
        </button>
        <div style={{ position: "relative", width: "100%" }}>
          <button onClick={() => setShowJoin(!showJoin)} className="menu-btn">
            join lobby
          </button>
          <div
            className={
              showJoin
                ? "show-join join-inputs-container"
                : "join-inputs-container"
            }
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div className="lobby-id-input">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <input
                    placeholder="lobby id"
                    type="text"
                    onChange={(ev) => setLobbyInput(ev.target.value)}
                    value={lobbyInput}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className="join-btn" onClick={() => joinLobby()}>
                    Join!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
