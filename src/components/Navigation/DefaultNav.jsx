import { NavLink } from "react-router-dom";
// import "./DefaultNav.css";
import { accessToken, refreshToken } from "../../utils/constants";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

const DefaultNav = () => {
  const {
    auth
  } = useAuth();

  const linkStyle = ({ isActive }) =>
    isActive
      ? "bg-black text-white hover:bg-gray-900 px-3 py-2 rounded-lg"
      : "text-white hover:bg-gray-900 px-3 py-2 rounded-lg";

    // isActive
    //   ? "text-white border-b-2 border-solid border-black px-3 py-2"
    //   : "text-white hover:border-b-2 border-solid border-black px-3 py-2";
  
  return (
    <>
      {!auth?.accessToken && (
        <>
          <nav className="bg-indigo-700 px-2 flex py-3 justify-between sm:px-10">
            <NavLink
              to="/"
              className="md:text-2xl text-white hover:bg-gray-900 px-3 py-2 rounded-lg"
            >
              Building Manager
            </NavLink>
            <div className="nav-items gap-x-2 flex md:gap-x-4">
              <NavLink className={linkStyle} to="/login">
                Sign In
              </NavLink>
              <NavLink to="/signup" className={linkStyle}>
                Sign Up
              </NavLink>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default DefaultNav;
