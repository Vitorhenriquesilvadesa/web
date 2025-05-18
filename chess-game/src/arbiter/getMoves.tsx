import { CastleDirection, type AllowedCastleDirections } from "../constants";
import { arbiter } from "./arbiter";

export function getRookMoves(
  currentPosition: string[][],
  piece: string,
  rank: number,
  file: number
) {
  const moves: number[][] = [];
  const us = piece[0];
  const enemy = us === "w" ? "b" : "w";
  const direction = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  direction.forEach((dir) => {
    for (let i = 1; i < 8; i++) {
      const x = rank + i * dir[0];
      const y = file + i * dir[1];

      if (
        currentPosition[x] === undefined ||
        currentPosition[x][y] === undefined
      ) {
        break;
      }

      if (currentPosition[x][y].startsWith(enemy)) {
        moves.push([x, y]);
        break;
      }

      if (currentPosition[x][y].startsWith(us)) {
        break;
      }

      moves.push([x, y]);
    }
  });

  return moves;
}

export function getQueenMoves(
  currentPosition: string[][],
  piece: string,
  rank: number,
  file: number
) {
  return [
    ...getBishopMoves(currentPosition, piece, rank, file),
    ...getRookMoves(currentPosition, piece, rank, file),
  ];
}

export function getPawnMoves(
  position: string[][],
  piece: string,
  rank: number,
  file: number
) {
  const moves = [];
  const dir = piece === "wp" ? 1 : -1;

  // Move two tiles on first move
  if (rank % 5 === 1) {
    if (
      position?.[rank + dir]?.[file] === "" &&
      position?.[rank + dir + dir]?.[file] === ""
    ) {
      moves.push([rank + dir + dir, file]);
    }
  }

  // Move one tile
  if (!position?.[rank + dir]?.[file]) {
    moves.push([rank + dir, file]);
  }

  return moves;
}

export function getPawnCaptures(
  position: string[][],
  prevPosition: string[][],
  piece: string,
  rank: number,
  file: number
) {
  const moves = [];
  const dir = piece === "wp" ? 1 : -1;

  const enemy = piece[0] === "w" ? "b" : "w";

  if (!(rank + dir > 7 || rank + dir < 0 || file - 1 > 7 || file - 1 < 0)) {
    if (
      position[rank + dir][file - 1] &&
      position[rank + dir][file - 1].startsWith(enemy)
    ) {
      moves.push([rank + dir, file - 1]);
    }
  }

  if (!(rank + dir > 7 || rank + dir < 0 || file + 1 > 7 || file + 1 < 0)) {
    if (
      position[rank + dir][file + 1] &&
      position[rank + dir][file + 1].startsWith(enemy)
    ) {
      moves.push([rank + dir, file + 1]);
    }
  }

  const enemyPawn = dir === 1 ? "bp" : "wp";
  const adjacentFiles = [file - 1, file + 1];

  const x = rank;
  const y = file;

  if (!(x > 7 || x < 0 || y > 7 || y < 0)) {
    if (prevPosition !== undefined) {
      if ((dir === 1 && x === 4) || (dir === -1 && x === 3)) {
        adjacentFiles.forEach((f) => {
          if (
            position[x][f] === enemyPawn &&
            position[x + dir + dir][f] === "" &&
            prevPosition[x][f] === "" &&
            prevPosition[x + dir + dir][f] === enemyPawn
          ) {
            moves.push([rank + dir, f]);
          }
        });
      }
    }
  }

  return moves;
}

export function getKingMoves(
  currentPosition: string[][],
  piece: string,
  rank: number,
  file: number
) {
  const moves: number[][] = [];
  const us = piece[0];
  const direction = [
    [1, -1],
    [1, 0],
    [1, 1],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ];

  direction.forEach((dir) => {
    const x = rank + dir[0];
    const y = file + dir[1];

    if (x > 7 || x < 0 || y > 7 || y < 0) {
      return;
    }

    if (
      currentPosition[x][y] !== undefined &&
      !currentPosition[x][y].startsWith(us)
    ) {
      moves.push([x, y]);
    }
  });

  return moves;
}

export function getBishopMoves(
  currentPosition: string[][],
  piece: string,
  rank: number,
  file: number
) {
  const moves: number[][] = [];
  const us = piece[0];
  const enemy = us === "w" ? "b" : "w";
  const direction = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  direction.forEach((dir) => {
    for (let i = 1; i < 8; i++) {
      const x = rank + i * dir[0];
      const y = file + i * dir[1];

      if (
        currentPosition[x] === undefined ||
        currentPosition[x][y] === undefined
      ) {
        break;
      }

      if (currentPosition[x][y].startsWith(enemy)) {
        moves.push([x, y]);
        break;
      }

      if (currentPosition[x][y].startsWith(us)) {
        break;
      }

      moves.push([x, y]);
    }
  });

  return moves;
}

export function getKnightMoves(
  currentPosition: string[][],
  piece: string,
  rank: number,
  file: number
) {
  const moves: number[][] = [];
  const us = piece[0];
  const enemy = currentPosition[rank][file].startsWith("w") ? "b" : "w";
  const candidates = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  candidates.forEach((c) => {
    const x = rank + c[0];
    const y = file + c[1];

    if (x > 7 || x < 0 || y > 7 || y < 0) {
      return;
    }

    const cell = currentPosition[x][y];
    if (cell !== undefined && (cell.startsWith(enemy) || cell === "")) {
      moves.push([x, y]);
    }
  });

  return moves;
}

export function getCastlingMoves(
  position: string[][],
  castleDirection: CastleDirection,
  piece: string,
  rank: number,
  file: number
) {
  const moves: number[][] = [];

  if (
    file !== 4 ||
    rank % 7 !== 0 ||
    castleDirection === CastleDirection.none
  ) {
    return moves;
  }

  if (piece.startsWith("w")) {
    if (arbiter.isPlayerInCheck(position, [], "w")) {
      return moves;
    }
    if (
      [CastleDirection.left, CastleDirection.both].includes(castleDirection) &&
      !position[0][3] &&
      !position[0][2] &&
      !position[0][1] &&
      position[0][0] === "wr" &&
      !arbiter.isPlayerInCheck(
        arbiter.performMove(position, piece, rank, file, 0, 3),
        position,
        "w"
      ) &&
      !arbiter.isPlayerInCheck(
        arbiter.performMove(position, piece, rank, file, 0, 2),
        position,
        "w"
      )
    ) {
      moves.push([0, 2]);
    }
    if (
      [CastleDirection.right, CastleDirection.both].includes(castleDirection) &&
      !position[0][5] &&
      !position[0][6] &&
      position[0][7] === "wr" &&
      !arbiter.isPlayerInCheck(
        arbiter.performMove(position, piece, rank, file, 0, 5),
        position,
        "w"
      ) &&
      !arbiter.isPlayerInCheck(
        arbiter.performMove(position, piece, rank, file, 0, 6),
        position,
        "w"
      )
    ) {
      moves.push([0, 6]);
    }
  } else {
    if (arbiter.isPlayerInCheck(position, [], "b")) {
      return moves;
    }

    if (
      [CastleDirection.left, CastleDirection.both].includes(castleDirection) &&
      !position[7][3] &&
      !position[7][2] &&
      !position[7][1] &&
      position[7][0] === "br" &&
      !arbiter.isPlayerInCheck(
        arbiter.performMove(position, piece, rank, file, 7, 3),
        position,
        "b"
      ) &&
      !arbiter.isPlayerInCheck(
        arbiter.performMove(position, piece, rank, file, 7, 2),
        position,
        "b"
      )
    ) {
      moves.push([7, 2]);
    }
    if (
      [CastleDirection.right, CastleDirection.both].includes(castleDirection) &&
      !position[7][5] &&
      !position[7][6] &&
      position[7][7] === "br" &&
      !arbiter.isPlayerInCheck(
        arbiter.performMove(position, piece, rank, file, 7, 5),
        position,
        "b"
      ) &&
      !arbiter.isPlayerInCheck(
        arbiter.performMove(position, piece, rank, file, 7, 6),
        position,
        "b"
      )
    ) {
      moves.push([7, 6]);
    }
  }

  return moves;
}

export function getCastleDirections(
  castleDirections: AllowedCastleDirections,
  piece: string,
  rank: number,
  file: number
) {
  const direction = piece.startsWith("w")
    ? castleDirections.w
    : castleDirections.b;

  if (piece.endsWith("k")) {
    return CastleDirection.none;
  }

  if (file === 0 && rank === 0) {
    if (direction === CastleDirection.both) {
      return CastleDirection.right;
    }

    if (direction === CastleDirection.left) {
      return CastleDirection.none;
    }
  }
  if (file === 7 && rank === 0) {
    if (direction === CastleDirection.both) {
      return CastleDirection.left;
    }

    if (direction === CastleDirection.right) {
      return CastleDirection.none;
    }
  }

  if (file === 0 && rank === 7) {
    if (direction === CastleDirection.both) {
      return CastleDirection.right;
    }

    if (direction === CastleDirection.left) {
      return CastleDirection.none;
    }
  }
  if (file === 7 && rank === 7) {
    if (direction === CastleDirection.both) {
      return CastleDirection.left;
    }

    if (direction === CastleDirection.right) {
      return CastleDirection.none;
    }
  }
}

export function getKingPosition(position: string[][], player: string) {
  let kingPos: number[] = [];

  position.forEach((rank, x) => {
    rank.forEach((file, y) => {
      if (position[x][y].startsWith(player) && position[x][y].endsWith("k")) {
        kingPos = [x, y];
      }
    });
  });

  return kingPos;
}

export type EnemyPiece = {
  piece: string;
  file: number;
  rank: number;
};

export function getPieces(position: string[][], enemy: string) {
  const enemyPieces: EnemyPiece[] = [];

  position.forEach((rank, x) => {
    rank.forEach((file, y) => {
      if (position[x][y].startsWith(enemy)) {
        enemyPieces.push({ piece: position[x][y], rank: x, file: y });
      }
    });
  });

  return enemyPieces;
}
