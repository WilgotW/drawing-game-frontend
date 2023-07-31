import React, { useContext, useState, useEffect } from "react";
import "./PlayerList.css";
import { AppContext } from "../../context/AppContext";

export default function PlayersList() {
  const { playersInLobby, thisPlayersId } = useContext(AppContext);
  const [sortedPlayers, setSortedPlayers] = useState([...playersInLobby]);
  const [changedPlayer, setChangedPlayer] = useState(null);

  useEffect(() => {
    setSortedPlayers([...playersInLobby].sort((a, b) => b.score - a.score));
  }, [playersInLobby]);

  useEffect(() => {
    // After a short delay, reset the background color of the changed player
    if (changedPlayer) {
      const resetBackground = setTimeout(() => {
        setChangedPlayer(null);
      }, 500);

      return () => clearTimeout(resetBackground);
    }
  }, [changedPlayer]);

  const handleScoreChange = (player) => {
    // When the score changes, set the player as the changed player
    setChangedPlayer(player);

    // Add your logic to update the score in the actual playersInLobby array
    // For example, if each player object has a playerId property, you can find the player by playerId and update the score.
  };

  return (
    <div className="player-list-main-container">
      {sortedPlayers.map((player) => (
        <div key={player.playerId} className="bordered-bottom">
          <div
            className={`player-card ${
              player === changedPlayer ? "blink-white" : ""
            }`}
            style={{ color: player.correctGuess ? "lightgreen" : "white" }}
          >
            <div className="player-profile"></div>
            <>
              <div
                style={{ width: "fit-content", display: "flex", gap: "5px" }}
              >
                {player.playerName}
                <div>{player.playerId === thisPlayersId && <b> [you]</b>}</div>
              </div>
            </>

            <span onClick={() => handleScoreChange(player)}>
              score: {player.score}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
