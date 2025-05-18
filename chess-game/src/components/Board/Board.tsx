import "./Board.css";
import Ranks from "./bits/Ranks.tsx";
import Files from "./bits/Files.tsx";
import Pieces from "./Pieces/Pieces.tsx";
import { useAppContext } from "../../context/Context.tsx";
import Popup from "../Popup/Popup.tsx";
import { arbiter } from "../../arbiter/arbiter.tsx";
import { getKingPosition } from "../../arbiter/getMoves.tsx";
import PromotionBox from "../Popup/PromotionBox/PromotionBox.tsx";
import GameEnds from "../Popup/GameEnds/GameEnds.tsx";

export default function Board() {
  const ranks = Array(8)
    .fill(0)
    .map((x, i) => 8 - i);

  const files = Array(8)
    .fill(0)
    .map((x, i) => i + 1);

  const { appState } = useAppContext();
  const position = appState.position[appState.position.length - 1];

  const isChecked = (() => {
    const isInCheck = arbiter.isPlayerInCheck(position, [], appState.turn);

    if (isInCheck) {
      return getKingPosition(position, appState.turn);
    }

    return null;
  })();

  const getClassName = (i: number, j: number): string => {
    let c = "tile";
    c += (i + j) % 2 === 0 ? " tile--dark " : " tile--light ";

    if (appState.candidateMoves.find((m) => m[0] === i && m[1] === j)) {
      if (position[i][j]) {
        c += " attacking";
      } else {
        c += " highlight";
      }
    }

    if (isChecked && isChecked[0] === i && isChecked[1] === j) {
      c += " checked";
    }
    return c;
  };

  return (
    <div className="board">
      <Ranks ranks={ranks.map((r) => r.toString())} />
      <div className="tiles">
        {ranks.map((rank, i) =>
          files.map((file, j) => (
            <div
              key={`${rank}-${file}`}
              className={getClassName(7 - i, j)}
            ></div>
          ))
        )}
      </div>

      <Pieces />

      <Popup>
        <PromotionBox onClosePopup={() => {}} />
        <GameEnds onClosePopup={() => {}} />
      </Popup>

      <Files files={files.map((f) => f.toString())} />
    </div>
  );
}
