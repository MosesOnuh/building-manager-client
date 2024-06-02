import React from "react";
import { FaBus, FaExclamationTriangle } from "react-icons/fa";
import { CancelBtn, ProceedBtn } from "../buttons/MainBtns";

function CausionModal({ message, onCloseModal, handleAction }) {
  return (
    <div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center"
    >
      <div className="flex flex-col w-fit items-center row-gap-2 bg-white p-5 rounded-lg mx-auto my-4">
        <FaExclamationTriangle className="text-red-900" />

        <p className="text-center md:pt-2 text-xs md:text-sm lg:text-base my-2 sm:my-4">
          {message}
        </p>
        <div className="flex gap-4">
          <CancelBtn OnClick={onCloseModal} />
          <ProceedBtn OnClick={handleAction} />
        </div>
      </div>
    </div>
  );
}

export default CausionModal;
