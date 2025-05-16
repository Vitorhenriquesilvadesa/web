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
      console.log("dir", dir, "X", x, "Y", y);

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
