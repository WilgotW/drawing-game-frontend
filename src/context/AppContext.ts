import React, { createContext } from "react";

interface AppContextType {
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setActiveColor: React.Dispatch<React.SetStateAction<string>>;
  activeColor: string;
  setPenWidth: React.Dispatch<React.SetStateAction<number>>;
  penWidth: number;
}

export const AppContext = createContext<AppContextType>({
  setUserName: () => {},
  userName: "",
  setActiveColor: () => {},
  activeColor: "",
  setPenWidth: () => {},
  penWidth: 5,
});
