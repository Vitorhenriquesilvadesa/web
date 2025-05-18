import { arbiter } from "../../../arbiter/arbiter";
import type { CastleDirection } from "../../../constants";
import { useAppContext } from "../../../context/Context";
import { generateCandidateMoves } from "../../../reducer/actions/move";

interface PieceProps {
  rank: number;
  file: number;
  piece: string;
}

export default function Piece({ rank, file, piece }: PieceProps) {
  const { appState, dispatch } = useAppContext();
  const { turn, position, castleDirection } = appState;
  const currentPosition = position[position.length - 1];
  const prevPosition = position[position.length - 2];

  function onDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
    setTimeout(() => {
      const target = event.target as HTMLDivElement;
      target.style.display = "none";
    }, 0);
    if (turn === piece[0]) {
      const direction = turn === "w" ? castleDirection.w : castleDirection.b;
      const candidateMoves = arbiter.getValidMoves(
        currentPosition,
        prevPosition,
        direction,
        piece,
        rank,
        file
      );
      dispatch(
        generateCandidateMoves({
          candidateMoves: candidateMoves,
          newPosition: [],
        })
      );
    }
  }

  function onDragEnd(event: React.DragEvent<HTMLDivElement>) {
    const target = event.target as HTMLDivElement;
    target.style.display = "block";
  }

  return (
    <div
      className={`piece ${piece} p-${file}${rank}`}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    />
  );
}
