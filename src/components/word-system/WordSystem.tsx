import React, { useEffect, useState } from "react";
import randomIntegerNum from "../../functions/randomIntegerNum";

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
  useEffect(() => {
    fetch("../public/wordList.txt")
      .then((response) => response.text())
      .then((content) => {
        console.log(content);
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

  useEffect(() => {
    if (randomWords.length === 3) {
      console.log(randomWords);
    }
  }, [randomWords]);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div>{word}</div>
    </div>
  );
}
