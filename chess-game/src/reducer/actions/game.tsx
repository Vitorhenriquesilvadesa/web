import type { Action, CastleDirection } from "../../constants";
import ActionTypes from "./actionTypes";

export function updateCastling(direction: CastleDirection): Action {
  return {
    type: ActionTypes.canCastle,
    payload: {
      candidateMoves: [],
      newPosition: [],
      direction,
    },
  };
}

export function detectStalemate(): Action {
  return {
    type: ActionTypes.stalemate,
    payload: {
      candidateMoves: [],
      newPosition: [],
    },
  };
}

export function detectCheckMate(winner: string): Action {
  return {
    type: ActionTypes.win,
    payload: {
      candidateMoves: [],
      newPosition: [],
    },
    winner,
  };
}
