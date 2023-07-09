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

function App() {
  const [activeColor, setActiveColor] = useState<string>("black");
  const [penWidth, setPenWidth] = useState<number>(5);

  const [activeWord, setActiveWord] = useState<string>("");
  // const [allWords, setAllWords] = useState<string[]>([]);
  const [randomWords, setRandomWords] = useState<string[]>([]);

  const [playerId, setPlayerId] = useState<string>("");
  const [playersTurn, setPlayersTurn] = useState<boolean>(false);

  const [revealingWord, setRevealingWord] = useState<string>("");

  const [doUndo, setDoUndo] = useState<boolean>(false);

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
      {playersTurn && !revealingWord && <WordPopup randomWords={randomWords} />}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <RevealingWord revealingWord={revealingWord} />
        <div style={{ display: "flex", gap: "10px" }}>
          <PlayersList />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* <DrawingSpace
              playersTurn={playersTurn}
              activeColor={activeColor}
              penWidth={penWidth}
              doUndo={doUndo}
              setDoUndo={setDoUndo}
            /> */}
            <CanvasDrawing
              playersTurn={playersTurn}
              activeColor={activeColor}
              penWidth={penWidth}
            />
            {playersTurn && (
              <PenOptions
                setActiveColor={setActiveColor}
                activeColor={activeColor}
                setPenWidth={setPenWidth}
                penWidth={penWidth}
                setDoUndo={setDoUndo}
              />
            )}
          </div>
          <GuessChat />
        </div>
      </div>
    </div>
  );
}

export default App;
