import "./App.css";
import DrawingSpace from "./components/drawing-space/DrawingSpace";
import { useEffect, useState } from "react";
import PenOptions from "./components/pen-options/PenOptions";
import WordSystem from "./components/word-system/WordSystem";
import { socket } from "./socket";
import WordPopup from "./components/word-popup/WordPopup";

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
  // useEffect(() => {
  //   console.log("ehe");
  //   return () => {
  //     socket.off("player_info");
  //     socket.off("start_round");
  //   };
  // }, []);

  socket.on("player_info", (player) => {
    console.log("ehehheh");
    console.log(player.playerId);
    setPlayerId(player.playerId);
  });

  socket.on("start_round", (words) => {
    setRandomWords(words);
    setPlayersTurn(true);
  });

  socket.on("word_update", (word) => {
    setRevealingWord(word);
  });

  return (
    <div className="app-main-container">
      {playersTurn && !revealingWord && <WordPopup randomWords={randomWords} />}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {revealingWord && (
            <div
              style={{
                width: `${revealingWord.length * 25}px`,
                minWidth: "200px",
              }}
              className="revealing-word"
            >
              {revealingWord.split("").map((letter, index) => (
                <h1 key={index}>{letter}</h1>
              ))}
            </div>
          )}
        </div>
        <DrawingSpace
          playersTurn={playersTurn}
          activeColor={activeColor}
          penWidth={penWidth}
          doUndo={doUndo}
          setDoUndo={setDoUndo}
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
    </div>
  );
}

export default App;
