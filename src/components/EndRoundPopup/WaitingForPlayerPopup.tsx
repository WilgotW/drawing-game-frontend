import { useContext, useEffect, useState } from "react";
import "./WaitingForPlayerPopup.css";
import { AppContext } from "../../context/AppContext";

interface IProps {
  playerChoosingWord: boolean;
}
export default function WaitingForPlayerPopup({ playerChoosingWord }: IProps) {
  const { playersInLobby } = useContext(AppContext);

  const [playersName, setPlayersName] = useState<string>("");

  useEffect(() => {
    if (!playersInLobby) return;
    const player = playersInLobby.find((player) => player.playersTurn);
    if (player?.playerName) {
      setPlayersName(player.playerName);
    }
  }, [playersInLobby]);

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
        position: "absolute",
      }}
    >
      <div
        className={
          playerChoosingWord
            ? "end-round-main-container end-round-show"
            : "end-round-main-container animate"
        }
      >
        <div
          style={{
            width: "100%",
            height: "70%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>{playersName} is picking a word</h1>
        </div>
      </div>
    </div>
  );
}
