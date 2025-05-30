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

  if (piece.endsWith("k") && Math.abs(y - file) > 1) {
    if (y === 2) {
      newPosition[rank][0] = "";
      newPosition[rank][3] = piece.startsWith("w") ? "wr" : "br";
    }
    if (y === 6) {
      newPosition[rank][7] = "";
      newPosition[rank][5] = piece.startsWith("w") ? "wr" : "br";
    }
  }

  newPosition[rank][file] = "";
  newPosition[x][y] = piece;

  return newPosition;
}
