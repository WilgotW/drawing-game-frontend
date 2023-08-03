import React, { useContext, useState, useEffect } from "react";
import "./PlayerList.css";
import { AppContext } from "../../context/AppContext";
import popSound from "../../sounds/pop-sound.wav";
import playSound from "../../functions/playSound";
import body from "../../assets/body.png";

interface IProps {
  headCustomizations: ImageType[];
  eyeCustomizations: ImageType[];
}

type ImageType = string;

export default function PlayersList({
  headCustomizations,
  eyeCustomizations,
}: IProps) {
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
            <div
              style={{
                transform: "scale(0.6)",
                background: "none",
              }}
              className="lobby-player-card"
            >
              <div className="player-card-body">
                <img
                  style={{ boxShadow: "0 0 50px rgba(0, 0, 0, 0.5)" }}
                  src={body}
                  alt=""
                />
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
            </div>

            <div>
              <>
                <div
                  style={{
                    width: "fit-content",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  {player.playerName}
                  <div>
                    {player.playerId === thisPlayersId && <b> [you]</b>}
                  </div>
                </div>
              </>

              <span className={index === 0 ? "player-first-place" : ""}>
                score: {player.score}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
