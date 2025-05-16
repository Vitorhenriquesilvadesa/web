import type { Action, MovePayload } from "../../constants";
import ActionTypes from "./actionTypes";

export function makeNewMove(newPosition: MovePayload): Action {
  return {
    type: ActionTypes.move,
    payload: newPosition,
  };
}

export function generateCandidateMoves(candidateMoves: MovePayload): Action {
  return {
    type: ActionTypes.generateCandidateMoves,
    payload: candidateMoves,
  };
}

export function clearCandidateMoves(): Action {
  return {
    type: ActionTypes.clearCandidateMoves,
    payload: { candidateMoves: [], newPosition: [] },
  };
}
