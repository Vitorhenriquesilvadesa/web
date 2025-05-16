import "./Pieces.css";
import Piece from "./Piece.tsx";
import { useRef } from "react";
import { copyPosition } from "../../helper.tsx";
import { useAppContext } from "../../context/Context.tsx";
import type { Action, AppState } from "../../constants.tsx";
import {
  clearCandidateMoves,
  makeNewMove,
} from "../../reducer/actions/move.tsx";
import { arbiter } from "../../arbiter/arbiter.tsx";

export default function Pieces() {
  const ref = useRef<HTMLDivElement>(null);
  const { appState, dispatch } = useAppContext() as {
    appState: AppState;
    dispatch: React.Dispatch<Action>;
  };

  const currentPosition = appState.position[appState.position.length - 1];

  function calculateCoords(event: React.DragEvent<HTMLDivElement>): {
    x: number;
    y: number;
  } {
    const element = ref.current?.getBoundingClientRect();
    const { width, left, top } = element as DOMRect;
    const size = width / 8;
    const y = Math.floor((event.clientX - left) / size);
    const x = 7 - Math.floor((event.clientY - top) / size);
    return { x, y };
  }

  function move(event: React.DragEvent<HTMLDivElement>) {
    const { x, y } = calculateCoords(event);
    const data = event.dataTransfer.getData("text/plain");
    const [piece, rankStr, fileStr] = data.split(",");
    const rank = parseInt(rankStr, 10);
    const file = parseInt(fileStr, 10);

    if (appState.candidateMoves.find((m) => m[0] === x && m[1] === y)) {
      const newPosition = arbiter.performMove(
        currentPosition,
        piece,
        rank,
        file,
        x,
        y
      );
      dispatch(makeNewMove({ newPosition, candidateMoves: [] }));
    }

    dispatch(clearCandidateMoves());
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    move(event);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div className="pieces" ref={ref} onDragOver={onDragOver} onDrop={onDrop}>
      {currentPosition.map((r, rank) =>
        r.map((f, file) =>
          currentPosition[rank][file] ? (
            <Piece
              key={`${rank}-${file}`}
              rank={rank}
              file={file}
              piece={currentPosition[rank][file]}
            />
          ) : (
            ""
          )
        )
      )}
    </div>
  );
}
