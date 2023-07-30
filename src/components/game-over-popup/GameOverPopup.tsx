import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import "./GameOver.css";

interface PlayerProps {
  playerName: string;
  playerId: string;
  playersTurn: boolean;
  joinedLobbyId: string;
  score: number;
  correctGuess: boolean;
  thisRoundsScore: number;
}
export default function GameOverPopup() {
  const { playersInLobby, gameOver } = useContext(AppContext);
  const [organizedPlayers, setOrganizedPlayers] = useState<PlayerProps[]>();

  useEffect(() => {
    if (gameOver) {
      const sortedPlayers = [...playersInLobby].sort(
        (a, b) => b.score - a.score
      );
      setOrganizedPlayers(sortedPlayers);
    }
  }, [gameOver]);
  return (
    <div className="players-summary-list">
      <div
        style={{
          width: "100%",
          height: "70%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {organizedPlayers?.map((player, index) => (
            <>
              {index === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "30px",
                  }}
                >
                  <h1>
                    {player.playerName} wins! ({player.score})
                  </h1>
                </div>
              ) : (
                <h3>
                  #{index + 1} {player.playerName} ({player.score})
                </h3>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
