import { createPosition } from "./helper";
import type ActionTypes from "./reducer/actions/actionTypes";

export type AppContextType = {
  appState: AppState;
  dispatch: React.Dispatch<Action>;
};

export type AppState = {
  position: string[][][];
  turn: string;
  candidateMoves: number[][];
};

export type MovePayload = {
  newPosition: string[][];
  candidateMoves: number[][];
};

export type Action = {
  type: ActionTypes;
  payload: MovePayload;
};

export const initialGameState: AppState = {
  candidateMoves: [],
  position: [createPosition()],
  turn: "w",
};
