import React, { useState } from "react";
import "./TextInput.css";
import Select from "react-select";

export const InputField = ({
  type,
  InputTitle,
  InputName,
  PlaceHolder,
  InputValue,
  OnChange,
  loading,
  editMode,
  maximumLength
}) => {
  return (
    <>
      <label htmlFor={InputName} className="block ml-3 text-xs font-inter ">
        {InputTitle}
      </label>
      <input
        className={`${
          editMode
            ? "border-indigo-400 focus:border-indigo-700"
            : "border-black-60 focus:border-black"
        } focus:outline-none rounded-lg py-1 pl-2 mt-1 w-full border-2 border-solid sm:py-2 text-xs md:text-sm lg:text-base`}
        type={type || "text"}
        // placeholder={PlaceHolder || InputTitle}
        placeholder={PlaceHolder && PlaceHolder}
        name={InputName || InputTitle}
        value={InputValue}
        onChange={OnChange}
        // required
        id={InputName}
        disabled={loading}
        maxLength={maximumLength + 1}
      />
    </>
  );
};

export const TextAreaField = ({
  type,
  InputTitle,
  InputName,
  InputValue,
  // PlaceHolder,
  // value,
  OnChange,
  loading,
  editMode,
  maximumLength
}) => {
  return (
    <>
      <label htmlFor={InputName} className="block ml-3 text-xs font-inter ">
        {InputTitle}
      </label>
      <textarea
        // style={{ borderColor: "rgb(0,0,0,0.6)" }}
        // className="border-indigo-400 focus:border-indigo-700 focus:outline-none rounded-lg py-1 pl-2 mt-1 w-full border-2 border-solid sm:py-2 text-xs md:text-sm lg:text-base"
        className={`${
          editMode
            ? "border-indigo-400 focus:border-indigo-700"
            : "border-black-60 focus:border-black"
        } focus:outline-none rounded-lg py-1 pl-2 mt-1 w-full border-2 border-solid sm:py-2 text-xs md:text-sm lg:text-base`}
        id={InputName}
        name={InputName || InputTitle}
        value={InputValue}
        onChange={OnChange}
        disabled={loading}
        // required
        rows={3}
        maxLength={maximumLength + 1}
      />
    </>
  );
};

export const SelectInputField = ({
  type,
  InputTitle,
  InputName,
  // PlaceHolder,
  InputValue,
  OnChange,
  loading,
  selectOptions,
  editMode
}) => {
  return (
    <>
      <label
        htmlFor={InputName}
        // style={{ minWidth: "fit-content" }}
        className="block ml-3 text-xs font-inter "
      >
        {InputTitle}
      </label>
      <select
        // style={{ borderColor: "rgb(0,0,0,0.6)" }}
        // className="border-indigo-400 focus:border-indigo-700 focus:outline-none rounded-lg py-1 pl-2 mt-1 w-full border-2 border-solid sm:py-2 text-xs md:text-sm lg:text-base"
        className={`${
          editMode
            ? "border-indigo-400 focus:border-indigo-700"
            : "border-black-60 focus:border-black"
        } focus:outline-none rounded-lg py-1 pl-2 mt-1 w-full border-2 border-solid sm:py-2 text-xs md:text-sm lg:text-base`}
        id={InputName}
        name={InputName || InputTitle}
        value={InputValue}
        onChange={OnChange}
        disabled={loading}
        // required
      >
        {selectOptions?.map((item) => {
          return <option value={item.value}> {item.text}</option>;
        })}
      </select>
    </>
  );
};

export const DefaultSelect = ({
  InputTitle,
  InputName,
  InputValue,
  OnChange,
  selectOptions,
}) => {
  return (<>
    <label
      htmlFor={InputName}
      style={{ minWidth: "fit-content" }}
      className="block ml-3 mb-1 text-xs font-inter "
    >
      {InputTitle}
    </label>
    <Select
      value={InputValue}
      onChange={OnChange}
      options={selectOptions}
      // placeholder="Select Country"
      // isSearchable
    />
  </>);
  
};

export const SearchSelect = ({
  InputTitle,
  InputName,
  InputValue,
  OnChange,
  selectOptions,
  customStyles,
  Searchable,
}) => {
  return (
    <>
      <label
        htmlFor={InputName}
        style={{ minWidth: "fit-content" }}
        className="block ml-3 mb-1 text-xs font-inter "
      >
        {InputTitle}
      </label>

      <div className="text-xs md:text-sm">
        {" "}
        <Select
          value={InputValue}
          onChange={OnChange}
          options={selectOptions}
          styles={customStyles}
          isSearchable={Searchable}
          maxMenuHeight={150}
          classNamePrefix={"seachSelect"}
        />
      </div>
    </>
  );
};
// const SearchSelect = ({ InputTitle, InputName, InputValue }) => {};

export const TextInput = ({
  type,
  InputTitle,
  InputName,
  // PlaceHolder,
  InputValue,
  OnChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  // const [inputValue, setInputValue] = useState("");

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // const handleChange = (event) => {
  //   setInputValue(event.target.value);
  // };

  return (
    <div className="input-container">
      <input
        style={{ borderColor: "rgb(0,0,0,0.6)" }}
        // className=" rounded-lg py-1 pl-2 mt-1 w-full border-x border-y border-solid mt-2 sm:py-2"
        className=" rounded-lg py-1 pl-2 mt-1 w-full border-x border-y border-solid mt-2 sm:py-2"
        type={type}
        name={InputName || InputTitle}
        id={InputName}
        value={InputValue}
        onChange={OnChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required
      />
      <label
        className={`input-label  ${
          isFocused || InputValue ? "placeholder-top" : ""
        }`}
      >
        {InputTitle}
      </label>
    </div>
  );
};

// export default TextInput;
