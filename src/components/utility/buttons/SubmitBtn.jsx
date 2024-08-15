import React from "react";

function SubmitBtn({loading }) {
  return (
    <input
      // className={`rounded-2xl py-2 px-5 mt-3 ${
      className={`rounded-2xl py-2 px-5 ${
        loading
          ? "bg-indigo-500 hover:bg-indigo-500"
          : "bg-indigo-700 hover:bg-indigo-900"
      }  hover:text-white text-white`}
      type="submit"
      disabled={loading}
    />
  );
}

export default SubmitBtn;
