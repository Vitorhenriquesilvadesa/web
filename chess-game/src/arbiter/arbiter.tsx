import {
  getBishopMoves,
  getKingMoves,
  getKnightMoves,
  getPawnCaptures,
  getPawnMoves,
  getQueenMoves,
  getRookMoves,
} from "./getMoves";
import { movePawn, movePiece } from "./move";

export const arbiter = {
  performMove: function (
    position: string[][],
    piece: string,
    rank: number,
    file: number,
    x: number,
    y: number
  ): string[][] {
    if (piece.endsWith("p")) {
      return movePawn(position, piece, rank, file, x, y);
    } else {
      return movePiece(position, piece, rank, file, x, y);
    }
  },

  getRegularMoves: function (
    currentPosition: string[][],
    prevPosition: string[][],
    piece: string,
    rank: number,
    file: number
  ): number[][] {
    switch (piece.charAt(piece.length - 1)) {
      case "r":
        return getRookMoves(currentPosition, piece, rank, file);
      case "n":
        return getKnightMoves(currentPosition, piece, rank, file);
      case "b":
        return getBishopMoves(currentPosition, piece, rank, file);
      case "q":
        return getQueenMoves(currentPosition, piece, rank, file);
      case "k":
        return getKingMoves(currentPosition, piece, rank, file);
      case "p":
        return getPawnMoves(currentPosition, piece, rank, file);
      default:
        throw Error("Unrecognized piece");
    }
  },

  getValidMoves: function (
    currentPosition: string[][],
    prevPosition: string[][],
    piece: string,
    rank: number,
    file: number
  ): number[][] {
    let moves = this.getRegularMoves(
      currentPosition,
      prevPosition,
      piece,
      rank,
      file
    );

    if (piece.endsWith("p")) {
      moves = [
        ...moves,
        ...getPawnCaptures(currentPosition, prevPosition, piece, rank, file),
      ];
    }

    return moves;
  },
};
