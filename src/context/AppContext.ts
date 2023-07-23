import React, { createContext } from "react";

interface PlayerProps {
  playerName: string;
  playerId: string;
  playersTurn: boolean;
  joinedLobbyId: string;
}

interface AppContextType {
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setActiveColor: React.Dispatch<React.SetStateAction<string>>;
  activeColor: string;
  setPenWidth: React.Dispatch<React.SetStateAction<number>>;
  penWidth: number;
  setPlayersInLobby: React.Dispatch<React.SetStateAction<PlayerProps[]>>;
  playersInLobby: PlayerProps[];
  setLobbyId: React.Dispatch<React.SetStateAction<string>>;
  lobbyId: string;
}

export const AppContext = createContext<AppContextType>({
  setUserName: () => {},
  userName: "",
  setActiveColor: () => {},
  activeColor: "",
  setPenWidth: () => {},
  penWidth: 5,
  setPlayersInLobby: () => {},
  playersInLobby: [],
  setLobbyId: () => {},
  lobbyId: "",
});
