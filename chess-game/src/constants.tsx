import { createPosition } from "./helper";
import type ActionTypes from "./reducer/actions/actionTypes";

export type AppContextType = {
  appState: AppState;
  dispatch: React.Dispatch<Action>;
};

export type AllowedCastleDirections = {
  w: CastleDirection;
  b: CastleDirection;
};

export type AppState = {
  position: string[][][];
  turn: string;
  candidateMoves: number[][];
  status: Status;
  promotionSquare?: PromotionPayload;
  castleDirection: AllowedCastleDirections;
  winner?: string;
};

export type PromotionPayload = {
  rank: number;
  file: number;
  x: number;
  y: number;
};

export type MovePayload = {
  newPosition: string[][];
  candidateMoves: number[][];
  promotion?: PromotionPayload;
  direction?: CastleDirection;
};

export type Action = {
  type: ActionTypes;
  payload: MovePayload;
  winner?: string;
};

export enum Status {
  onGoing,
  promoting,
  stalemate,
  white,
  black,
}

export enum CastleDirection {
  both,
  left,
  right,
  none,
}

export const initialGameState: AppState = {
  candidateMoves: [],
  position: [createPosition()],
  turn: "w",
  status: Status.onGoing,
  castleDirection: {
    w: CastleDirection.both,
    b: CastleDirection.both,
  },
};
