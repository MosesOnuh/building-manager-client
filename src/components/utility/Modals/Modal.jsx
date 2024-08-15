import React, { Children } from "react";
import { FaXmark } from "react-icons/fa6";

function AppModal({ children, onCloseModal }) {
  return (
    <div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 100 }}
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center"
    >
      {/* <div className="activity-display-modal-container"> */}
      <div
        style={{ maxHeight: "89%" }}
        className="bg-white overflow-y-auto w-full sm:w-4/5 lg:w-3/5 py-4 px-4 sm:px-6 sm:rounded-2xl pb-10"
      >
        <div>
          <FaXmark
            onClick={onCloseModal}
            className="text-2xl ml-auto mb-3 hover:text-red-900"
          />
        </div>
        {children}
      </div>
    </div>
  );
}

export default AppModal;
