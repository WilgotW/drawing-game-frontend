import React, { createContext } from "react";

interface AppContextType {
  setActiveColor: React.Dispatch<React.SetStateAction<string>>;
  activeColor: string;
  setPenWidth: React.Dispatch<React.SetStateAction<number>>;
  penWidth: number;
}

export const AppContext = createContext<AppContextType>({
  setActiveColor: () => {},
  activeColor: "",
  setPenWidth: () => {},
  penWidth: 5,
});
