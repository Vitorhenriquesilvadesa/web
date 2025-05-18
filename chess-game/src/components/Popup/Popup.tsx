import React, { type ReactElement } from "react";
import { Status } from "../../constants";
import { useAppContext } from "../../context/Context";
import { closePopup } from "../../reducer/actions/popup";
import "./Popup.css";

interface PopupProps {
  children: React.ReactNode;
}

export default function Popup({ children }: PopupProps) {
  const { appState, dispatch } = useAppContext();

  if (appState.status === Status.onGoing) {
    return null;
  }

  function onClosePopup() {
    dispatch(closePopup());
  }

  return (
    <div className="popup">
      {React.Children.toArray(children).map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as ReactElement<{ onClosePopup: () => void }>,
            { onClosePopup }
          );
        }
        return child;
      })}
    </div>
  );
}
