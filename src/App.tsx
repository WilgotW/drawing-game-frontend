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
import TimeCountdown from "./components/time-countdown/TimeCountdown";

interface customizationsProps {
  head: number;
  eye: number;
}
interface PlayerProps {
  playerName: string;
  playerId: string;
  playersTurn: boolean;
  joinedLobbyId: string;
  score: number;
  correctGuess: boolean;
  thisRoundsScore: number;
  customizations: customizationsProps;
}

function App() {
  //canvas
  const [activeColor, setActiveColor] = useState<string>("black");
  const [penWidth, setPenWidth] = useState<number>(5);
  //lobby
  const [playersInLobby, setPlayersInLobby] = useState<PlayerProps[]>([]);
  const [lobbyId, setLobbyId] = useState<string>("");
  const [playerChoosingWord, setPlayerChoosingWord] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [roundsToPlay, setRoundsToPlay] = useState<number>(3);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [timePerGame, setTimePerGame] = useState<number>(50);
  //words
  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [revealingWord, setRevealingWord] = useState<string>("");
  //player
  const [userName, setUserName] = useState<string>("");
  const [thisPlayersId, setThisPlayersId] = useState<string>("");
  const [playersTurn, setPlayersTurn] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  //main
  const [showGame, setShowGame] = useState<boolean>(false);
  const [showEndRoundPopup, setShowEndRoundPopup] = useState<boolean>(false);
  const [correctWord, setCorrectWord] = useState<string>("");

  socket.on("get_player_id", (playerId: string) => setThisPlayersId(playerId));
  socket.on("set_lobby_id", (lobbyId: string) => setLobbyId(lobbyId));
  socket.on("end_round", (data) => {
    setCorrectWord(data.correctWord);
    setCurrentRound(data.lobbyRound);
    setShowEndRoundPopup(true);
  });
  socket.on("word_update", (word: string) => {
    setRevealingWord(word);
    setPlayerChoosingWord(false);
  });
  socket.on("starting_the_game", (roundsPlayed: number) => {
    setCurrentRound(roundsPlayed);
    setGameOver(false);
    setShowGame(true);
    setPlayerChoosingWord(true);
    setShowEndRoundPopup(false);
  });

  socket.on("start_round", (words: string[]) => {
    setRandomWords(words);
    setPlayersTurn(true);
  });
  socket.on("player_update", (playersList: any) => {
    if (playersList.length === 1 && !isHost) {
      setIsHost(true);
    }
    const newPlayersInLobby = playersList.map((player) => ({
      playerName: player.playerName,
      playerId: player.playerId,
      playersTurn: player.playersTurn,
      joinedLobbyId: player.joinedLobbyId,
      score: player.score,
      thisRoundsScore: player.thisRoundsScore,
      correctGuess: player.correctGuess,
      customizations: player.customizations,
    }));
    setPlayersInLobby(newPlayersInLobby);
  });

  socket.on("end_round", () => {
    setRevealingWord("");
    setRandomWords([]);
    setPlayersTurn(false);
  });

  socket.on("end_whole_game", () => {
    setGameOver(true);
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
          correctWord,
          gameOver,
        }}
      >
        {showGame ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <TimeCountdown
              currentRound={currentRound}
              roundsToPlay={roundsToPlay}
              playersTurn={playersTurn}
              timePerGame={timePerGame}
            />
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
                  playerChoosingWord={playerChoosingWord}
                  showEndRoundPopup={showEndRoundPopup}
                />
              </div>
              <GuessChat playersTurn={playersTurn} />
            </div>
          </div>
        ) : (
          <>
            {playersInLobby.length > 0 ? (
              <LobbyRoom
                roundsToPlay={roundsToPlay}
                setRoundsToPlay={setRoundsToPlay}
                isHost={isHost}
                setTimePerGame={setTimePerGame}
                timePerGame={timePerGame}
              />
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
