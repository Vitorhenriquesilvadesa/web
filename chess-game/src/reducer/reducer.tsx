import { Status, type Action, type AppState } from "../constants";
import ActionTypes from "./actions/actionTypes";

export function reducer(state: AppState, action: Action): AppState {
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

    case ActionTypes.promotionOpen: {
      return {
        ...state,
        candidateMoves: [],
        status: Status.promoting,
        promotionSquare: action.payload.promotion,
      };
    }

    case ActionTypes.promotionClose: {
      let { turn } = state;
      turn = turn === "w" ? "b" : "w";
      return {
        ...state,
        turn,
        candidateMoves: [],
        status: Status.onGoing,
        promotionSquare: undefined,
      };
    }

    case ActionTypes.canCastle: {
      let { turn, castleDirection } = state;

      if (turn === "w") {
        castleDirection.w = action.payload.direction!;
      } else {
        castleDirection.b = action.payload.direction!;
      }

      return {
        ...state,
        castleDirection,
      };
    }

    case ActionTypes.stalemate: {
      return {
        ...state,
        status: Status.stalemate,
      };
    }

    case ActionTypes.win: {
      return {
        ...state,
        winner: action.winner,
      };
    }

    default: {
      return state;
    }
  }
}
