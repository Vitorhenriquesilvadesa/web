import type { CastleDirection } from "../constants";
import {
  getBishopMoves,
  getKingMoves,
  getKnightMoves,
  getPawnCaptures,
  getPawnMoves,
  getQueenMoves,
  getRookMoves,
  getCastlingMoves,
  getKingPosition,
  getPieces,
  type EnemyPiece as EnemyPiece,
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
    position: string[][],
    prevPosition: string[][],
    castleDirection: CastleDirection,
    piece: string,
    rank: number,
    file: number
  ): number[][] {
    let moves = this.getRegularMoves(position, prevPosition, piece, rank, file);
    const notInCheckMoves: number[][] = [];

    if (piece.endsWith("p")) {
      moves = [
        ...moves,
        ...getPawnCaptures(position, prevPosition, piece, rank, file),
      ];
    }
    if (piece.endsWith("k")) {
      moves = [
        ...moves,
        ...getCastlingMoves(position, castleDirection, piece, rank, file),
      ];
    }

    moves.forEach(([x, y]: number[]) => {
      const positionAfterMove = this.performMove(
        position,
        piece,
        rank,
        file,
        x,
        y
      );

      if (!this.isPlayerInCheck(positionAfterMove, position, piece[0])) {
        notInCheckMoves.push([x, y]);
      }
    });

    return notInCheckMoves;
  },

  isPlayerInCheck: function (
    positionAfterMove: string[][],
    position: string[][],
    player: string
  ) {
    const enemy = player.startsWith("w") ? "b" : "w";
    let kingPos = getKingPosition(positionAfterMove, player);
    const enemyPieces: EnemyPiece[] = getPieces(positionAfterMove, enemy);

    const enemyMoves: number[][] = enemyPieces.reduce<number[][]>(
      (acc, p): number[][] =>
        (acc = [
          ...acc,
          ...(p.piece.endsWith("p")
            ? getPawnCaptures(
                positionAfterMove,
                position,
                p.piece,
                p.rank,
                p.file
              )
            : this.getRegularMoves(
                positionAfterMove,
                position,
                p.piece,
                p.rank,
                p.file
              )),
        ]),
      []
    );

    if (
      enemyMoves.some(
        ([x, y]: number[]) => kingPos[0] === x && kingPos[1] === y
      )
    ) {
      return true;
    }

    return false;
  },

  isStalemate: function (
    position: string[][],
    player: string,
    castleDirection: CastleDirection
  ) {
    const isInCheck = this.isPlayerInCheck(position, [], player);

    if (isInCheck) {
      return false;
    }

    const pieces = getPieces(position, player);
    const moves: number[][] = pieces.reduce<number[][]>(
      (acc: number[][], p) =>
        (acc = [
          ...acc,
          ...this.getValidMoves(
            position,
            [],
            castleDirection,
            p.piece,
            p.rank,
            p.file
          ),
        ]),
      []
    );

    return !isInCheck && moves.length === 0;
  },

  isCheckMate: function (
    position: string[][],
    player: string,
    castleDirection: CastleDirection
  ) {
    const isInCheck = this.isPlayerInCheck(position, [], player);

    if (!isInCheck) return false;

    const pieces = getPieces(position, player);
    const moves = pieces.reduce<number[][]>(
      (acc, p) =>
        (acc = [
          ...acc,
          ...this.getValidMoves(
            position,
            [],
            castleDirection,
            p.piece,
            p.rank,
            p.file
          ),
        ]),
      []
    );

    return isInCheck && moves.length === 0;
  },
};
