import { createContext, useContext } from "react";
import type { Action, AppContextType, AppState } from "../constants";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext(): {
  appState: AppState;
  dispatch: React.Dispatch<Action>;
} {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContext.Provider");
  }

  return context;
}

export default AppContext;
