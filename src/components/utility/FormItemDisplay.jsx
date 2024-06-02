import React from "react";

function FormItemDisplay({ title, value, Style }) {
  return (
    // <div className="my-3">
    <>
      <p
        style={{ width: "fit-content" }}
        className="ml-3 text-xs font-inter "
      >
        {title}
      </p>
      <p
        style={{ borderColor: "rgb(0,0,0,0.6)"}}
        className={`rounded-lg py-1  px-3 mt-1 border-2 border-solid sm:py-2 text-xs md:text-sm lg:text-base ${Style}`}
      >
        {value}
      </p>
    </>
  );
}

export function FormItemDisplayBig({ title, value }) {
  return (
    <>
      <p className="ml-3 text-xs font-inter ">{title}</p>
      <div
        style={{ borderColor: "rgb(0,0,0,0.6)" }}
        className="text-xs md:text-sm lg:text-base rounded-lg py-1 px-3 mt-1 w-full border-2 border-solid sm:py-2 max-h-24 overflow-y-auto"
      >
        <p className="">{value}</p>
      </div>
    </>
  );
}

export default FormItemDisplay;
