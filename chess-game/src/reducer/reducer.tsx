import type { Action, AppState } from "../constants";
import ActionTypes from "./actions/actionTypes";

export const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case ActionTypes.move: {
      let { turn, position } = state;
      turn = turn === "w" ? "b" : "w";
      position = [...position, action.payload.newPosition];

      return { ...state, turn, position };
    }

    case ActionTypes.generateCandidateMoves: {
      return { ...state, candidateMoves: action.payload.candidateMoves };
    }

    case ActionTypes.clearCandidateMoves: {
      return {
        ...state,
        candidateMoves: [],
      };
    }

    default: {
      return state;
    }
  }
};
