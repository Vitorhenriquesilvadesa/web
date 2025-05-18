import { useAppContext } from "../../../context/Context";
import { copyPosition } from "../../../helper";
import {
  clearCandidateMoves,
  makeNewMove,
} from "../../../reducer/actions/move";
import "./PromotionBox.css";

export interface PromotionBoxProps {
  onClosePopup: () => void;
}

export default function PromotionBox({ onClosePopup }: PromotionBoxProps) {
  const options = ["q", "r", "b", "n"];

  const { appState, dispatch } = useAppContext();
  const { promotionSquare } = appState;

  if (!promotionSquare) {
    return null;
  }

  const color = promotionSquare.x === 7 ? "w" : "b";

  function getPromotionBoxPosition() {
    const style: React.CSSProperties = {};

    if (!promotionSquare) {
      return null;
    }

    console.log(promotionSquare.x);

    if (promotionSquare.x === 7) {
      style.top = "-12.5%";
    } else {
      style.top = "97.5%";
    }

    if (promotionSquare.y <= 1) {
      style.left = "0%";
    } else if (promotionSquare.y >= 6) {
      style.right = "0%";
    } else {
      style.left = `${12.5 * promotionSquare.y - 20}%`;
    }

    return style;
  }

  const promotionBoxPosition = getPromotionBoxPosition();

  function onClick(option: string) {
    onClosePopup();
    const newPosition = copyPosition(
      appState.position[appState.position.length - 1]
    );

    if (!promotionSquare) {
      return null;
    }

    newPosition[promotionSquare.rank][promotionSquare.file] = "";
    newPosition[promotionSquare.x][promotionSquare.y] = color + option;

    dispatch(clearCandidateMoves());
    dispatch(
      makeNewMove({
        newPosition,
        candidateMoves: [],
      })
    );
  }

  return (
    <div
      className="popup-inner promotion-choices"
      style={promotionBoxPosition == null ? {} : promotionBoxPosition}
    >
      {options.map((option) => (
        <div
          key={option}
          className={`piece ${color}${option}`}
          onClick={() => onClick(option)}
        ></div>
      ))}
    </div>
  );
}
