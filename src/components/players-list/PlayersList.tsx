import React, { useContext, useState, useEffect } from "react";
import "./PlayerList.css";
import { AppContext } from "../../context/AppContext";
import popSound from "../../sounds/pop-sound.wav";
import playSound from "../../functions/playSound";

export default function PlayersList() {
  const { playersInLobby, thisPlayersId } = useContext(AppContext);
  const [sortedPlayers, setSortedPlayers] = useState([...playersInLobby]);
  const [scoreAddedPlayer, setScoreAddedPlayer] = useState<string>();
  useEffect(() => {
    setScoreAddedPlayer("");
    if (sortedPlayers) {
      playersInLobby.forEach((player) => {
        //find player
        const p = sortedPlayers.find(
          (sortedPlayer) => sortedPlayer.playerId === player.playerId
        );
        if (p?.score !== player.score) {
          //player score changed
          setScoreAddedPlayer(player.playerId);
          playSound(popSound);
        }
      });
    }

    setSortedPlayers([...playersInLobby].sort((a, b) => b.score - a.score));
  }, [playersInLobby]);

  return (
    <div className="player-list-main-container">
      {sortedPlayers.map((player, index) => (
        <div
          key={player.playerId}
          className={
            player.playerId === scoreAddedPlayer
              ? "bordered-bottom blink-animation"
              : "bordered-bottom"
          }
        >
          <div
            className={"player-card"}
            style={{ color: player.correctGuess ? "lightgreen" : "white" }}
          >
            <div className="player-profile"></div>
            <>
              <div
                style={{
                  width: "fit-content",
                  display: "flex",
                  gap: "5px",
                }}
              >
                {player.playerName}
                <div>{player.playerId === thisPlayersId && <b> [you]</b>}</div>
              </div>
            </>

            <span className={index === 0 ? "player-first-place" : ""}>
              score: {player.score}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
