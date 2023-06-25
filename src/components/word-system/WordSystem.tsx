import React, { useEffect, useState } from "react";
import randomIntegerNum from "../../functions/randomIntegerNum";
import "./WordSystem.css";

interface IProps {
  word: string;
  activeWord: string;
  setActiveWord: React.Dispatch<React.SetStateAction<string>>;
  allWords: string[];
  setAllWords: React.Dispatch<React.SetStateAction<string[]>>;
  randomWords: string[];
  setRandomWords: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function WordSystem({
  word,
  activeWord,
  setActiveWord,
  allWords,
  setAllWords,
  randomWords,
  setRandomWords,
}: IProps) {
  const [hiddenWord, setHiddenWord] = useState<string>("");
  const [revealedLetters, setRevealedLetters] = useState<number[]>([]);

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
    // beginRevealing();
  }, [word]);

  useEffect(() => {
    if (hiddenWord.includes("_")) {
      console.log("continue");
      beginRevealing();
    } else {
      console.log("no left");
    }
  }, [hiddenWord]);

  function beginRevealing() {
    setTimeout(() => {
      let nonExistingNum: number;
      do {
        nonExistingNum = randomIntegerNum(0, word.length - 1);
        console.log(nonExistingNum);
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
    }, 1000);
  }

  useEffect(() => {
    fetch("../public/wordList.txt")
      .then((response) => response.text())
      .then((content) => {
        if (content) {
          const words = content
            .replace(/\r\n/g, "")
            .split(".")
            .map((word) => word.trim());

          setAllWords(words.slice(0, words.length - 1));
        }
      })
      .catch((error) => console.error("Error fetching file:", error));
  }, []);

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
