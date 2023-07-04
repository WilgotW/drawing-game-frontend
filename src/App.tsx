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
    console.log(words);
    setRandomWords(words);
    setPlayersTurn(true);
  });

  socket.on("word_update", (word) => {
    console.log(word);
    setRevealingWord(word);
  });

  return (
    <div className="app-main-container">
      {revealingWord && <div>{revealingWord}</div>}
      {playersTurn && !revealingWord && <WordPopup randomWords={randomWords} />}
      <div>
        {/* <WordSystem
          word={activeWord}
          activeWord={activeWord}
          setActiveWord={setActiveWord}
          allWords={allWords}
          setAllWords={setAllWords}
          randomWords={randomWords}
          setRandomWords={setRandomWords}
          playersTurn={playersTurn}
        /> */}
        <DrawingSpace
          playersTurn={playersTurn}
          activeColor={activeColor}
          penWidth={penWidth}
        />
      </div>
      {playersTurn && (
        <PenOptions
          setActiveColor={setActiveColor}
          setPenWidth={setPenWidth}
          penWidth={penWidth}
        />
      )}
    </div>
  );
}

export default App;
