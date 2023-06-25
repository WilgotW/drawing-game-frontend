import "./App.css";
import DrawingSpace from "./components/drawing-space/DrawingSpace";
import { useEffect, useState } from "react";
import PenOptions from "./components/pen-options/PenOptions";
import WordSystem from "./components/word-system/WordSystem";

function App() {
  const [activeColor, setActiveColor] = useState<string>("black");
  const [penWidth, setPenWidth] = useState<number>(5);

  const [activeWord, setActiveWord] = useState<string>("");
  const [allWords, setAllWords] = useState<string[]>([]); // Update type to string[]
  const [randomWords, setRandomWords] = useState<string[]>([]);

  function selectWord(word: string) {
    setActiveWord(word);
  }

  useEffect;

  return (
    <div className="app-main-container">
      {!activeWord && (
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
        <DrawingSpace activeColor={activeColor} penWidth={penWidth} />
      </div>
      <PenOptions
        setActiveColor={setActiveColor}
        setPenWidth={setPenWidth}
        penWidth={penWidth}
      />
    </div>
  );
}

export default App;
