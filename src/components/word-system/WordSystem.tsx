import React, { useEffect, useState } from "react";
import randomIntegerNum from "../../functions/randomIntegerNum";
import "./WordSystem.css";
import { socket } from "../../socket";

interface IProps {
  word: string;
  activeWord: string;
  setActiveWord: React.Dispatch<React.SetStateAction<string>>;
  allWords: string[];
  setAllWords: React.Dispatch<React.SetStateAction<string[]>>;
  randomWords: string[];
  setRandomWords: React.Dispatch<React.SetStateAction<string[]>>;
  playersTurn: boolean;
}

export default function WordSystem({
  word,
  activeWord,
  setActiveWord,
  allWords,
  setAllWords,
  randomWords,
  setRandomWords,
  playersTurn,
}: IProps) {
  const [hiddenWord, setHiddenWord] = useState<string>("");
  const [revealedLetters, setRevealedLetters] = useState<number[]>([]);

  // socket.on("word_update", (hidden) => {
  //   setHiddenWord(hidden);
  // });

  useEffect(() => {
    if (hiddenWord.includes("_") || !word) {
      return;
    }

    let hiddenString = "";
    for (let i = 0; i < word.length; i++) {
      if (word[i] === " ") {
        hiddenString += " ";
      } else {
        hiddenString += "_";
      }
    }
    setHiddenWord(hiddenString);
    const data = {
      word: word,
      hiddenWord: hiddenString,
    };
    socket.emit("word_update", data);
  }, [word]);

  useEffect(() => {
    if (hiddenWord.includes("_")) {
      beginRevealing();
    }
  }, [hiddenWord]);

  function beginRevealing() {
    setTimeout(() => {
      let nonExistingNum: number;
      do {
        nonExistingNum = randomIntegerNum(0, word.length - 1);
      } while (
        revealedLetters.includes(nonExistingNum) ||
        word[nonExistingNum] === " "
      );

      setRevealedLetters([...revealedLetters, nonExistingNum]);

      const hiddenWordArray = hiddenWord.split("");
      const updatedHiddenWordArray = hiddenWordArray.map((letter, index) => {
        if (index === nonExistingNum) {
          return word[nonExistingNum];
        } else {
          return letter;
        }
      });

      const updatedHiddenWord = updatedHiddenWordArray.join("");
      setHiddenWord(updatedHiddenWord);

      const data = {
        word: word,
        hiddenWord: updatedHiddenWord,
      };
      socket.emit("word_update", data);
    }, 8000);
  }

  // useEffect(() => {
  //   fetch("../public/wordList.txt")
  //     .then((response) => response.text())
  //     .then((content) => {
  //       if (content) {
  //         const words = content
  //           .replace(/\r\n/g, "")
  //           .split(".")
  //           .map((word) => word.trim());

  //         setAllWords(words.slice(0, words.length - 1));
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching file:", error));
  // }, []);

  useEffect(() => {
    if (allWords.length > 0) {
      setRandomWords(getRandomWords(allWords, 3));
    }
  }, [allWords]);

  function getRandomWords(words: string[], count: number): string[] {
    const randomW: string[] = [];

    while (randomW.length < count) {
      const num = randomIntegerNum(0, words.length);
      const w = words[num];

      if (!randomW.includes(w)) {
        randomW.push(w);
      }
    }

    return randomW;
  }

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div className="hidden-word">{hiddenWord}</div>
    </div>
  );
}
