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
}

function App() {
  const [activeColor, setActiveColor] = useState<string>("black");
  const [penWidth, setPenWidth] = useState<number>(5);
  const [playersInLobby, setPlayersInLobby] = useState<PlayerProps[]>([]);

  const [activeWord, setActiveWord] = useState<string>("");
  // const [allWords, setAllWords] = useState<string[]>([]);
  const [randomWords, setRandomWords] = useState<string[]>([]);

  const [playerId, setPlayerId] = useState<string>("");
  const [playersTurn, setPlayersTurn] = useState<boolean>(false);

  const [revealingWord, setRevealingWord] = useState<string>("");

  const [userName, setUserName] = useState<string>("");

  const [lobbyId, setLobbyId] = useState<string>("");

  // const [doUndo, setDoUndo] = useState<boolean>(false);

  socket.on("set_lobby_id", (lobbyId) => {
    setLobbyId(lobbyId);
  });

  socket.on("player_info", (player: any) => {
    console.log(player.playerId);
    setPlayerId(player.playerId);
  });

  socket.on("start_round", (words: string[]) => {
    setRandomWords(words);
    setPlayersTurn(true);
  });

  socket.on("word_update", (word: string) => {
    setRevealingWord(word);
  });

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
        }}
      >
        {playersInLobby.length > 0 ? <LobbyRoom /> : <Menu />}

        {/* <div style={{ display: "flex", flexDirection: "column" }}>
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
      </div> */}
      </AppContext.Provider>
    </div>
  );
}

export default App;
