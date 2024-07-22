import React from "react";

function ActionButton({ onHandleAction, btnText, extraBtnClass }) {
  return (
    <>
      <button
        className={`${extraBtnClass}`}
        onClick={onHandleAction}
      >
        <span>{btnText}</span>
      </button>
    </>
  );
}

export default ActionButton;
