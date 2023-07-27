import "./App.css";
import DrawingSpace from "./components/drawing-space/DrawingSpace";
import { useEffect, useState } from "react";
import PenOptions from "./components/pen-options/PenOptions";
import WordSystem from "./components/word-system/WordSystem";
import { socket } from "./socket";
import WordPopup from "./components/word-popup/WordPopup";
import RevealingWord from "./components/revealing-word/RevealingWord";
import PlayersList from "./components/players-list/PlayersList";
import GuessChat from "./components/guess-chat/GuessChat";
import CanvasDrawing from "./components/canvas-drawing/CanvasDrawing";
import { AppContext } from "./context/AppContext";
import Menu from "./components/menu/Menu";
import LobbyRoom from "./components/lobby-room/LobbyRoom";

interface PlayerProps {
  playerName: string;
  playerId: string;
  playersTurn: boolean;
  joinedLobbyId: string;
  score: number;
  correctGuess: boolean;
}

function App() {
  //canvas
  const [activeColor, setActiveColor] = useState<string>("black");
  const [penWidth, setPenWidth] = useState<number>(5);
  //lobby
  const [playersInLobby, setPlayersInLobby] = useState<PlayerProps[]>([]);
  const [lobbyId, setLobbyId] = useState<string>("");
  //words
  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [revealingWord, setRevealingWord] = useState<string>("");
  //player
  const [userName, setUserName] = useState<string>("");
  const [thisPlayersId, setThisPlayersId] = useState<string>("");
  const [playersTurn, setPlayersTurn] = useState<boolean>(false);
  //main
  const [startGame, setStartGame] = useState<boolean>(false);
  const [showGame, setShowGame] = useState<boolean>(false);

  useEffect(() => {
    if (!startGame) return;
    socket.emit("start_game", {
      playersInLobby: playersInLobby,
      lobbyId: lobbyId,
    });
  }, [startGame]);

  socket.on("get_player_id", (playerId: string) => setThisPlayersId(playerId));
  socket.on("set_lobby_id", (lobbyId: string) => setLobbyId(lobbyId));
  socket.on("word_update", (word: string) => setRevealingWord(word));
  socket.on("starting_the_game", () => setShowGame(true));
  socket.on("start_round", (words: string[]) => {
    setRandomWords(words);
    setPlayersTurn(true);
  });
  socket.on("player_update", (playersList: any) => {
    const newPlayersInLobby = playersList.map((player) => ({
      playerName: player.playerName,
      playerId: player.playerId,
      playersTurn: player.playersTurn,
      joinedLobbyId: player.joinedLobbyId,
      score: player.score,
      correctGuess: player.correctGuess,
    }));
    setPlayersInLobby(newPlayersInLobby);
  });

  useEffect(() => {
    if (!playersInLobby) return;
    playersInLobby.forEach((player) => {
      if (player.playerId === thisPlayersId) {
        if (player.playersTurn) {
          setPlayersTurn(true);
        } else {
          setPlayersTurn(false);
        }
      }
    });
  }, [playersInLobby]);

  return (
    <div className="app-main-container">
      <AppContext.Provider
        value={{
          setUserName,
          userName,
          setActiveColor,
          activeColor,
          setPenWidth,
          penWidth,
          setPlayersInLobby,
          playersInLobby,
          setLobbyId,
          lobbyId,
          thisPlayersId,
        }}
      >
        {showGame ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <RevealingWord revealingWord={revealingWord} />
            <div style={{ display: "flex", gap: "10px" }}>
              <PlayersList />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <CanvasDrawing
                  playersTurn={playersTurn}
                  activeColor={activeColor}
                  penWidth={penWidth}
                  revealingWord={revealingWord}
                  randomWords={randomWords}
                />
              </div>
              <GuessChat playersTurn={playersTurn} />
            </div>
          </div>
        ) : (
          <>
            {playersInLobby.length > 0 ? (
              <LobbyRoom setStartGame={setStartGame} />
            ) : (
              <Menu />
            )}
          </>
        )}
      </AppContext.Provider>
    </div>
  );
}

export default App;
