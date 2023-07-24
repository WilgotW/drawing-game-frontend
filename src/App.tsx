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

  const [startGame, setStartGame] = useState<boolean>(false);
  const [showGame, setShowGame] = useState<boolean>(false);

  // const [doUndo, setDoUndo] = useState<boolean>(false);

  const [thisPlayersId, setThisPlayersId] = useState<string>();

  socket.on("get_player_id", (playerId: string) => {
    console.log("sent: " + playerId);
    setThisPlayersId(playerId);
  });

  useEffect(() => {
    console.log(thisPlayersId);
  }, [thisPlayersId]);

  socket.on("set_lobby_id", (lobbyId) => {
    setLobbyId(lobbyId);
  });

  socket.on("player_update", (playersList) => {
    console.log(playersList);
    const newPlayersInLobby = playersList.map((player) => ({
      playerName: player.playerName,
      playerId: player.playerId,
      playersTurn: player.playersTurn,
      joinedLobbyId: player.joinedLobbyId,
    }));
    setPlayersInLobby(newPlayersInLobby);
  });

  useEffect(() => {
    if (!playersInLobby) return;
    checkTurn();
  }, [playersInLobby]);
  function checkTurn() {
    playersInLobby.forEach((player) => {
      if (player.playerId === thisPlayersId) {
        if (player.playersTurn === true) {
          setPlayersTurn(true);
        } else {
          setPlayersTurn(false);
        }
      }
    });
  }

  useEffect(() => {
    if (playersTurn) {
      socket.emit("get_random_words", thisPlayersId);
    }
  }, [playersTurn]);

  // socket.on("player_info", (player: any) => {
  //   console.log(player.playerId);
  //   setPlayerId(player.playerId);
  // });

  socket.on("start_round", (words: string[]) => {
    setRandomWords(words);
    setPlayersTurn(true);
  });

  socket.on("word_update", (word: string) => {
    setRevealingWord(word);
  });

  socket.on("starting_the_game", () => {
    setShowGame(true);
  });

  useEffect(() => {
    console.log(startGame);
    if (!startGame) return;

    socket.emit("start_game", {
      playersInLobby: playersInLobby,
      lobbyId: lobbyId,
    });
  }, [startGame]);

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
        {showGame ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
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
          </div>
        ) : (
          <>
            {playersInLobby.length > 0 ? (
              <LobbyRoom setStartGame={setStartGame} />
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
