import React from 'react'

function GeneralBtn({ children, loading, OnClick }) {
  return (
    <button
      onClick={OnClick}
      //removed mt-3
      className={`rounded-2xl py-2 px-5 text-xs md:text-sm lg:text-base border-2 ${
        loading
          ? "bg-indigo-500 hover:bg-indigo-500 border-indigo-500"
          : "bg-indigo-700 hover:bg-indigo-900 hover:border-indigo-900"
      }  hover:text-white text-white`}
      // type="submit" value={Title}
      disabled={loading}
    >
      {children}
    </button>
  );
}

export function ClearBtn({ children, loading, OnClick }) {
  return (
    <button
      onClick={OnClick}
      //removed mt-3
      className={`rounded-2xl py-2 px-5 text-xs md:text-sm lg:text-base border-2 border-red-700 hover:bg-red-900 hover:text-white ${
        loading && "bg-gray-500 hover:bg-gray-500"
      }  hover:text-red-900 text-red-700`}
      // type="submit" value={Title}
      disabled={loading}
    >
      {children || "Clear"}
    </button>
  );
}

export function SubmitGeneralBtn({ children, loading, OnClick }) {
  return (
    <button
      onClick={OnClick}
      //removed mt-3 
      className={`rounded-2xl py-2 px-5 text-xs md:text-sm lg:text-base ${
        loading
          ? "bg-indigo-500 hover:bg-indigo-500"
          : "bg-indigo-700 hover:bg-indigo-900"
      }  hover:text-white text-white`}
      type="submit"
      disabled={loading}
    >
      {children}
    </button>
  );
}

export function ProceedBtn({loading, OnClick }) {
  return (
    <button
      onClick={OnClick}
      className={`rounded-2xl py-2 px-5 mt-3 text-xs md:text-sm lg:text-base ${
        loading ? "bg-red-500 hover:bg-red-500" : "bg-red-700 hover:bg-red-900"
      }  hover:text-white text-white`}
      // type="submit" value={Title}
      disabled={loading}
    >
      Proceed
    </button>
  );
}
export function CancelBtn({ loading, OnClick }) {
  return (
    <button
      onClick={OnClick}
      className={`rounded-2xl py-2 px-5 mt-3 text-xs md:text-sm lg:text-base ${
        loading
          ? "bg-indigo-500 hover:bg-grey-500"
          : "bg-indigo-700 hover:bg-grey-900"
      }  hover:text-white text-white`}
      // type="submit" value={Title}
      disabled={loading}
    >
      Cancel
    </button>
  );
}

export default GeneralBtn