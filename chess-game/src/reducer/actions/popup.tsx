import type { Action } from "../../constants";
import ActionTypes from "./actionTypes";

export function openPromotion(
  rank: number,
  file: number,
  x: number,
  y: number
): Action {
  return {
    type: ActionTypes.promotionOpen,
    payload: {
      candidateMoves: [],
      newPosition: [],
      promotion: {
        rank,
        file,
        x,
        y,
      },
    },
  };
}

export function closePopup(): Action {
  return {
    type: ActionTypes.promotionClose,
    payload: {
      candidateMoves: [],
      newPosition: [],
    },
  };
}
