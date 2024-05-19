import React from 'react'

function SubmitButton1({Title, loading}) {
  return (
    <input
      //   className="rounded-md py-2 pl-2 mt-3 w-full bg-indigo-700 hover:bg-indigo-900 hover:text-white text-white"
      className={`rounded-2xl py-2 px-5 mt-3 ${
        loading
          ? "bg-indigo-500 hover:bg-indigo-500"
          : "bg-indigo-700 hover:bg-indigo-900"
      }  hover:text-white text-white`}
      type="submit"
      value={Title}
      disabled= {loading}
    />
  );
}

export default SubmitButton1