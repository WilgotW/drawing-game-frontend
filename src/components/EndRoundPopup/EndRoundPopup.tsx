import React, { useContext, useEffect, useState } from "react";
import "./EndRoundPopup.css";
import { AppContext } from "../../context/AppContext";
export default function EndRoundPopup() {
  const { playersInLobby } = useContext(AppContext);

  const [playersName, setPlayersName] = useState<string>("");

  useEffect(() => {
    if (!playersInLobby) return;
    const player = playersInLobby.find((player) => player.playersTurn);
    setPlayersName(player!.playerName);
  }, [playersInLobby]);

  return (
    <div className="end-round-main-container">
      <div
        style={{
          width: "100%",
          height: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>{playersName} picking a word</h1>
      </div>
    </div>
  );
}
