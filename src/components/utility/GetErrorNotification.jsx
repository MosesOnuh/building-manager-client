import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa';

function GetErrorNotification({customMessage, message}) {
  return (
    <div className="flex flex-col w-fit items-center row-gap-2 bg-pink-100 p-5 rounded-lg mx-auto my-4">
      <FaExclamationTriangle className="text-red-900" />

      <p className="text-center md:pt-2 text-xs md:text-sm lg:text-base">
        {customMessage
          ? customMessage
          : message
          ? `Error occurred when getting ${message}`
          : "Error occurred when getting data"}
      </p>
    </div>
  );
}

export default GetErrorNotification