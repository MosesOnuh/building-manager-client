import { Link } from "react-router-dom";
import "./DefaultNav.css";
import { accessToken, refreshToken } from "../../utils/constants";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

const DefaultNav = () => {
  //   const [auth, setAuth] = useState(null)
  // const token = sessionStorage.getItem(accessToken);
  //   useEffect(() =>{
  //     setAuth(token)
  //   }, [token])
  //   // const token = sessionStorage.getItem(accessToken);
  //   const logoutUser = () => {
  //     setAuth(null)
  //     sessionStorage.removeItem(accessToken);
  //     sessionStorage.removeItem(refreshToken);
  const { auth } = useAuth();
  return (
    <>
      <div className="navbar">
        <div className="navlogo-container">
          <Link to="/">
            <p>Building Manager</p>
          </Link>
        </div>
        <ul className="nav-items">
          <Link to="/login" class="nav-item">
            <li>
              {/* <a href="./about.html"> Sign In </a> */}
              {auth?.accessToken ? "" : "Sign In"}
            </li>
          </Link>
          <Link to="/signup" class="nav-item">
            <li>
              {/* <a href="./contact.html"> Sign Up </a> */}
              {/* Sign Up */}
              {auth?.accessToken ? "Sign Out" : "Sign Up"}
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
};

export default DefaultNav;
