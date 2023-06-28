import "./App.css";
import DrawingSpace from "./components/drawing-space/DrawingSpace";
import { useEffect, useState } from "react";
import PenOptions from "./components/pen-options/PenOptions";
import WordSystem from "./components/word-system/WordSystem";
import { socket } from "./socket";

function App() {
  const [activeColor, setActiveColor] = useState<string>("black");
  const [penWidth, setPenWidth] = useState<number>(5);

  const [activeWord, setActiveWord] = useState<string>("");
  const [allWords, setAllWords] = useState<string[]>([]);
  const [randomWords, setRandomWords] = useState<string[]>([]);

  const [playerId, setPlayerId] = useState<string>("");
  const [playersTurn, setPlayersTurn] = useState<boolean>(false);

  function selectWord(word: string) {
    setActiveWord(word);
  }

  useEffect(() => {
    socket.on("player_info", (player) => {
      console.log(player.playerId);
      setPlayerId(player.playerId);
    });

    socket.on("start_round", (playerTurn) => {
      console.log("Starting round");
      startGame(playerTurn);
    });

    return () => {
      socket.off("player_info");
      socket.off("start_round");
    };
  }, []);

  function startGame(id: string) {
    console.log("Starting game");
    if (id === playerId) {
      console.log("It's my turn");
      setPlayersTurn(true);
    } else {
      console.log("It's not my turn");
      setPlayersTurn(false);
    }
  }

  return (
    <div className="app-main-container">
      {!activeWord && playersTurn && (
        <div className="select-word-container">
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="word-selection-buttons">
              <h1 style={{ textAlign: "center" }}>SELECT A WORD</h1>
              <div style={{ display: "flex", gap: "20px", margin: "20px" }}>
                <button
                  className="word-select-button"
                  onClick={() => selectWord(randomWords[0])}
                >
                  {randomWords[0]}
                </button>
                <button
                  className="word-select-button"
                  onClick={() => selectWord(randomWords[1])}
                >
                  {randomWords[1]}
                </button>
                <button
                  className="word-select-button"
                  onClick={() => selectWord(randomWords[2])}
                >
                  {randomWords[2]}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <WordSystem
          word={activeWord}
          activeWord={activeWord}
          setActiveWord={setActiveWord}
          allWords={allWords}
          setAllWords={setAllWords}
          randomWords={randomWords}
          setRandomWords={setRandomWords}
        />
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
