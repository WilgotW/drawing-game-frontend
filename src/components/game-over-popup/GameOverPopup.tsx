import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import "./GameOver.css";
import body from "../../assets/body.png";

interface customizationsProps {
  head: number;
  eye: number;
}
interface PlayerProps {
  playerName: string;
  playerId: string;
  playersTurn: boolean;
  joinedLobbyId: string;
  score: number;
  correctGuess: boolean;
  thisRoundsScore: number;
  customizations: customizationsProps;
}
interface IProps {
  headCustomizations: ImageType[];
  eyeCustomizations: ImageType[];
}
type ImageType = string;

export default function GameOverPopup({
  headCustomizations,
  eyeCustomizations,
}: IProps) {
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
                <>
                  <div
                    style={{
                      transform: "scale(1.5) translateX(70px)",
                      background: "none",
                    }}
                    className="lobby-player-card"
                  >
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
                  </div>
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
                </>
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
