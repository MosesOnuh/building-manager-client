import React from 'react'
import { FaBus } from "react-icons/fa";

function NonFound({customMessage, message}) {
  return (
    <div className="flex flex-col w-fit items-center row-gap-2 bg-blue-100 p-5 rounded-lg mx-auto my-4">
      <FaBus className="text-red-900" />

      <p className="text-center md:pt-2 text-xs md:text-sm lg:text-base">
        {customMessage
          ? customMessage
          : message
          ? `No ${message} has been created`
          : "This has not been created yet"}
      </p>
    </div>
  );
}

export default NonFound