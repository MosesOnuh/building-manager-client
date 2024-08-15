import React from 'react'

function DateInput({
  InputTitle,
  InputName,
  PlaceHolder,
  InputValue,
  OnChange,
  loading
}) {
  return (
    <>
      <div className="my-3 ">
        <label htmlFor={InputName} className="block ml-3 text-xs font-inter ">
          {InputTitle}
        </label>
        <input
          style={{ borderColor: "rgb(0,0,0,0.6)" }}
          className=" rounded-lg py-1 pl-2 mt-1 w-full border-2 border-solid sm:py-2"
          type={type || "text"}
          placeholder={PlaceHolder || InputTitle}
          //   name="email"
          name={InputName || InputTitle}
          //   value={email}
          value={InputValue}
          onChange={OnChange}
          required
          id={InputName}
          disabled={loading}
        />
      </div>
    </>
  );
}

export default DateInput