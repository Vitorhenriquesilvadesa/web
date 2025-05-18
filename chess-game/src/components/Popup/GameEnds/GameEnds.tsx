import { Status } from "../../../constants";
import { useAppContext } from "../../../context/Context";
import { copyPosition } from "../../../helper";
import {
  clearCandidateMoves,
  makeNewMove,
} from "../../../reducer/actions/move";
import "./GameEnds.css";

export interface GameEndsProps {
  onClosePopup: () => void;
}

export default function GameEnds({ onClosePopup }: GameEndsProps) {
  const {
    appState,
    appState: { status },
    dispatch,
  } = useAppContext();

  if (status == Status.onGoing || status == Status.promoting) {
    return null;
  }

  const isWin = appState.winner !== undefined && appState.winner !== null;

  function newGame() {}

  return (
    <div className="popup--inner popup--inner__center">
      <h1>
        {isWin
          ? appState.winner === "w"
            ? "White Wins"
            : "Black Wins"
          : "Draw"}
      </h1>
      <div className={`${status.toString()}`} />
      <button onClick={newGame}>New Game</button>
    </div>
  );
}
