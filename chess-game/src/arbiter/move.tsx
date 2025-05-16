import { copyPosition } from "../helper";

export function movePawn(
  position: string[][],
  piece: string,
  rank: number,
  file: number,
  x: number,
  y: number
): string[][] {
  const newPosition = copyPosition(position);
  if (!newPosition[x][y] && x !== rank && y !== file) {
    newPosition[rank][y] = "";
  }

  newPosition[rank][file] = "";
  newPosition[x][y] = piece;

  return newPosition;
}

export function movePiece(
  position: string[][],
  piece: string,
  rank: number,
  file: number,
  x: number,
  y: number
): string[][] {
  const newPosition = copyPosition(position);
  newPosition[rank][file] = "";
  newPosition[x][y] = piece;

  return newPosition;
}
