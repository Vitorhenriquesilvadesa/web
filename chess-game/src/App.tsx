import { useReducer } from "react";
import Board from "./components/Board/Board";
import AppContext from "./context/Context";
import { reducer } from "./reducer/reducer";
import { initialGameState } from "./constants";
import "./App.css";

export default function App() {
  const [appState, dispatch] = useReducer(reducer, initialGameState);

  const providerState = {
    appState,
    dispatch,
  };

  return (
    <AppContext.Provider value={providerState}>
      <div className="App">
        <Board />
      </div>
    </AppContext.Provider>
  );
}
