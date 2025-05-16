import { getCharacter } from "../../helper";
import "./Board.css";
import Ranks from "./bits/Ranks.tsx";
import Files from "./bits/Files.tsx";
import Pieces from "../Pieces/Pieces.tsx";
import { useAppContext } from "../../context/Context.tsx";

export default function Board() {
  const ranks = Array(8)
    .fill(0)
    .map((x, i) => 8 - i);

  const files = Array(8)
    .fill(0)
    .map((x, i) => i + 1);

  const { appState } = useAppContext();
  const position = appState.position[appState.position.length - 1];

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

      <Files files={files.map((f) => f.toString())} />
    </div>
  );
}
