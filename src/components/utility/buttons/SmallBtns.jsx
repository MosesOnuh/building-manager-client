import React from "react";

export function DownloadBtn({OnClick}) {
  return (
    <button className="text-xs bg-blue-100 text-black  py-1 px-2 rounded-lg hover:bg-blue-400 hover:text-white shadow-l" onClick={OnClick}>
      Download
    </button>
  );
}

export function DeleteBtn({ OnClick, children }) {
  return (
    <button
      className="text-xs bg-red-100 text-black  py-1 px-2 rounded-lg hover:bg-red-400 hover:text-white shadow-l"
      onClick={OnClick}
    >
      {children || "Delete"}
    </button>
  );
}

export function SmallDefaultBtn({ children, OnClick }) {
  return (
    <button
      className="text-xs bg-blue-100 text-black  py-1 px-2 rounded-lg hover:bg-blue-400 hover:text-white shadow-l mr-2"
      onClick={OnClick}
    >
      {/* Add file */}
      {children}
    </button>
  );
}
