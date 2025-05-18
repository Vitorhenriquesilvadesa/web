import "./Pieces.css";
import Piece from "./Piece.tsx";
import { useRef } from "react";
import { useAppContext } from "../../../context/Context.tsx";
import type { Action, AppState } from "../../../constants.tsx";
import {
  clearCandidateMoves,
  makeNewMove,
} from "../../../reducer/actions/move.tsx";
import { arbiter } from "../../../arbiter/arbiter.tsx";
import { openPromotion } from "../../../reducer/actions/popup.tsx";
import {
  getCastleDirections,
  getCastlingMoves,
} from "../../../arbiter/getMoves.tsx";
import {
  detectCheckMate,
  detectStalemate,
  updateCastling,
} from "../../../reducer/actions/game.tsx";

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

  function openPromotionBox(rank: number, file: number, x: number, y: number) {
    dispatch(openPromotion(rank, file, x, y));
  }

  function updateCastlingState(piece: string, rank: number, file: number) {
    const direction = getCastleDirections(
      appState.castleDirection,
      piece,
      rank,
      file
    );

    if (direction) {
      dispatch(updateCastling(direction));
    }
  }

  function move(event: React.DragEvent<HTMLDivElement>) {
    const { x, y } = calculateCoords(event);
    const data = event.dataTransfer.getData("text/plain");
    const [piece, rankStr, fileStr] = data.split(",");
    const rank = parseInt(rankStr, 10);
    const file = parseInt(fileStr, 10);
    const opponent = piece.startsWith("b") ? "w" : "b";
    const castleDirection = piece.startsWith("b")
      ? appState.castleDirection.w
      : appState.castleDirection.b;

    if (appState.candidateMoves.find((m) => m[0] === x && m[1] === y)) {
      if ((piece === "wp" && x === 7) || (piece == "bp" && x === 0)) {
        openPromotionBox(rank, file, x, y);
      }
      if (piece.endsWith("r") || piece.endsWith("k")) {
        updateCastlingState(piece, rank, file);
      }

      const newPosition = arbiter.performMove(
        currentPosition,
        piece,
        rank,
        file,
        x,
        y
      );
      dispatch(makeNewMove({ newPosition, candidateMoves: [] }));

      if (arbiter.isStalemate(newPosition, opponent, castleDirection)) {
        dispatch(detectStalemate());
      } else if (arbiter.isCheckMate(newPosition, opponent, castleDirection)) {
        dispatch(detectCheckMate(piece[0]));
      }
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
